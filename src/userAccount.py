import pymysql
import hashlib
import json
import random, string
import boto3
from botocore.exceptions import ClientError

SENDER = "The OurUTM Team <team.ourutm@gmail.com>"
# CONFIGURATION_SET = "ConfigSet"
AWS_REGION = "us-east-1"
CHARSET = "UTF-8"
HOST = 'slackoverflowdb.cyy8oalnodc0.ca-central-1.rds.amazonaws.com'
PORT = 3306
USER = 'admin'
PASSWORD = 'adminadmin'

def connect():
    '''
    Connect to the database and use slackoverflow database
    '''
    conn = pymysql.connect(host=HOST, port=PORT, user=USER,
                           passwd=PASSWORD, db='mysql')
    cur = conn.cursor()
    cur.execute("USE slackoverflowDB")
    return conn, cur

def createReturn(code, msg):
    return {
        "code": code,
        "msg": msg
    }

def getUserId(username):
    conn, cur = connect()
    sql = ('SELECT userId FROM userAccounts WHERE userUsername = %s'.format(conn))
    cur.execute(sql, username)
    userId = cur.fetchone()[0]
    cur.close()
    conn.close()
    return userId


def createUser(username, password, email):
    email = email.lower()
    # sensitize data. return (-1 for non unique email)
    if emailInDB(email) or usernameInDB(username):
        print("An account has already been created with this email address or username. If you have previously made an account, try logging in.")
        msg = "Email/username exists"
        return createReturn(code, msg)
 
    # try send confirmation email
    b = sendConfirmationEmail(username, email)
    if not b:
        msg = "email address does not exist or is not verified."
        code = 1
        return createReturn(code, msg)
    # else, create new user.
    hashed_password = hashSHA256(password)
    # print("The hashedpass is: %s", hashed_password)
    conn, cur = connect()
    sql = ('INSERT INTO userAccounts(userUsername, userPassword, userEmail) VALUES (%s, UNHEX(%s), %s)'.format(conn))
    # print("Successfully connected to database.")
    ret = cur.execute(sql, (username, hashed_password, email))

    # print(cur.rowcount)
    # print(cur.fetchall())
    if ret == 1:
        print("User successfully added to the table. Congratulations!")
        msg = "createUser: Success"
        code = 0
    else:
        print("For some reason the user could not be added to the table. Check database manually.")
        msg = "createUser: Failure"
        code = -1
    conn.commit()
    cur.close()
    conn.close()
    #return True
    return createReturn(code, msg)


def emailInDB(email):
    conn, cur = connect()
    sql = ('SELECT * FROM userAccounts WHERE userEmail = %s'.format(conn))
    # print("Successfully connected to database.")
    ret = cur.execute(sql, email)
    # print(cur.fetchall())
    cur.close()
    conn.close()
    if ret == 1:
        return True
    return False

# NEW 
def usernameInDB(username):
    conn, cur = connect()
    sql = ('SELECT * FROM userAccounts WHERE userUsername = %s'.format(conn))
    # print("Successfully connected to database.")
    ret = cur.execute(sql, username)
    # print(cur.fetchall())
    cur.close()
    conn.close()
    if ret == 1:
        return True
    return False    


def sendConfirmationEmail(username, email):
    recipient = email
    subject = "OurUTM Account Account Created"
    body_text = (
            "OurUTM Account Account Confirmation\r\nHey " + username + "! It seems like your OurUTM account was created successfully.\r\nYou can use this email address and your chosen password to log in to your new account")
    body_html = "<html><head></head><body><h1>OurUTM Account Account Confirmation</h1><p>Hey " + username + "! It seems like your OurUTM account was created successfully.<br>You can use this email address and your chosen password to log in to your new account.</p></body></html>"

    client = boto3.client('ses', region_name=AWS_REGION)
    # Try to send the email.
    try:
        # Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    recipient,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': body_html,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': body_text,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': subject,
                },
            },
            Source=SENDER,
            # If you are not using a configuration set, comment or delete the
            # following line
            # ConfigurationSetName=CONFIGURATION_SET,
        )
    # Display an error if something goes wrong.
    except ClientError as e:
        print(e.response['Error']['Message'])
        return False
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])
        return True


def hashSHA256(password):
    hash_object = hashlib.sha256(password.encode())
    return hash_object.hexdigest()


def resetPassword(email):
    # make sure email is in DB
    email = email.lower()
    newPass = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
    # print("The new password will be: ", newPass)
    # insert the new password into the database
    if not emailInDB(email):
        code = 1
        msg = "This email address is not in the database."
        return createReturn(code, msg)
    username = getUsername(email)
    hashed_password = hashSHA256(newPass)
    conn, cur = connect()
    sql = ('UPDATE userAccounts SET userPassword = UNHEX(%s) WHERE userEmail = %s'.format(conn))
    rows_affected = cur.execute(sql, (hashed_password, email))
    conn.commit()
    cur.close()
    conn.close()
    b = sendPasswordResetEmail(username, email, newPass)
    if not b:
        code = 1
        msg = "There was a problem sending the email. Make sure it exists."
        return createReturn(code, msg)
    if rows_affected > 0:
        code = 0,
        msg =  "resetPassword: Success"
        return createReturn(code, msg)
        

    code = -1,
    msg = "resetPassword: Failed"
    return createReturn(code, msg)
    
    # print("Successfully updated database's password")
    # print("New pass hashed is: ", hashed_password)

    # return "Success"


def getUsername(email):
    conn, cur = connect()
    sql = ('SELECT userUsername FROM userAccounts WHERE userEmail = %s'.format(conn))
    # cur.execute(sql, (hashed_password, email))
    ret = cur.execute(sql, email)
    t = cur.fetchone()
    cur.close()
    conn.close()
    return t[0]

def retrieveUsername(email):
    return createReturn(0, getUsername(email))


def sendPasswordResetEmail(username, email, password):
    recipient = email
    subject = "OurUTM Account Password Reset"
    body_text = (
                "OurUTM Account Password Reset\r\nHey " + username + "! It seems like you requested a password reset for your OurUTM account. The password has been temporarily set to " + password + ". \r\nYou can use this email address and the given password to log in to your account, and from there you can change your password.")
    body_html = "<html><head></head><body><h1>OurUTM Account Password Reset</h1><p>Hey " + username + "! It seems like you requested a password reset for your OurUTM account. The password has been temporarily set to <b>" + password + "<b>. <br>"
    "You can use this email address and the given password to log in to your account, and from there you can change your password.</p></body></html"

    client = boto3.client('ses', region_name=AWS_REGION)
    # Try to send the email.
    print("Trying")
    try:
        # Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    recipient,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': body_html,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': body_text,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': subject,
                },
            },
            Source=SENDER,
            # If you are not using a configuration set, comment or delete the
            # following line
            # ConfigurationSetName=CONFIGURATION_SET,
        )
        print("RESPO: ")
        print(response)
    # Display an error if something goes wrong.
    except ClientError as e:
        print("GAGA")
        print(e.response['Error']['Message'])
        return False
    except Error as e:
        print("oopsie")
        return False
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])
        return True


def login(email, password):
    # 1 hash password, format email
    email = email.lower()
    hashed_password = hashSHA256(password)
    # 2 check in database if match.
    conn, cur = connect()
    sql = ('SELECT * FROM userAccounts WHERE userEmail = %s AND userPassword = UNHEX(%s)'.format(conn))
    # print("Successfully connected to database.")
    ret = cur.execute(sql, (email, hashed_password))
    if ret == 1:
        username = getUsername(email)
        print(username + " has logged in.")
        sql = ('UPDATE userAccounts SET userLoggedIn = 1 WHERE userEmail = %s'.format(conn))
        cur.execute(sql, email)
        conn.commit()
        cur.close()
        conn.close()
        return createReturn(0, "login: successful")  
    else:
        print("The email and password don't seem to match")
        return createReturn(1, "login: failed")


def changePassword(email, old_password, new_password):
    # hash both
    hashed_old = hashSHA256(old_password)
    hashed_new = hashSHA256(new_password)
    email = email.lower()

    # check db record whether user is logged in AND old password is correct
    conn, cur = connect()
    sql = ('SELECT * FROM userAccounts WHERE userEmail = %s AND userPassword = UNHEX(%s) AND userLoggedIn = 1'.format(conn))
    ret = cur.execute(sql, (email, hashed_old))
    if ret == 1:
        #  successful. can now update password
        sql = ('UPDATE userAccounts SET userPassword = UNHEX(%s) WHERE userEmail = %s'.format(conn))
        rows_affected = cur.execute(sql, (hashed_new, email))
        conn.commit()
        cur.close()
        conn.close()
        print("Password was updated successfully.")
        return True
    else:
        print("You need to be logged in, and the current password must match the email address given.")
        return False

# NEW: FRIENDS
def getFriends(username):
    '''
    Check return the list of friends if email exists in database
    '''
    if usernameInDB(username): 
        userId = getUserId(username)
        conn, cur = connect()
        # get list of friends using this user Id
        sql = ('select q.userUsername from userAccounts as q, userFriends as w where w.userId1 = %s and q.userId = w.userId2 or w.userId2 = %s and q.userId = w.userId1;')
        cur.execute(sql, (userId, userId))
        listResults = cur.fetchall()
        givenFriends = [x[0] for x in listResults]
        # close connection
        cur.close()
        conn.close()
        return createReturn(0, givenFriends)
    return createReturn(1, "Username not in database.")

def areFriends(username1, username2):
    if usernameInDB(username1) and usernameInDB(username2):
        userIdFrom = getUserId(username1)
        userIdTo = getUserId(username2)
        conn, cur = connect()
        # return true if friends already
        sql = ('SELECT * FROM userFriends WHERE (userId1 = %s AND userId2 = %s) AND accepted = 1;'.format(conn))
        ret1 = cur.execute(sql, (userIdFrom, userIdTo))
        ret2 = cur.execute(sql, (userIdFrom, userIdTo))
        if ret1 == 1 or ret2 == 1:
            return True
    return False

def addFriend(usernameFrom, usernameTo):
    if usernameInDB(usernameFrom) and usernameInDB(usernameTo):
        if areFriends(usernameFrom, usernameTo):
            return createReturn(1, "Users are already friends!")
        conn, cur = connect()
        userIdFrom = getUserId(usernameFrom)
        userIdTo = getUserId(usernameTo)
        # check if friend request already sent
        sql = ('SELECT * FROM userFriends WHERE (userId1 = %s AND userId2 = %s) AND accepted = 0'.format(conn))
        if cur.execute(sql, (userIdFrom, userIdTo)):
            return createReturn(1, "Friend request has already been sent!")
        # otherwise, send request
        sql = ('INSERT INTO userFriends(userId1, userId2, accepted) VALUES (%s, %s, 0)'.format(conn))
        cur.execute(sql, (userIdFrom, userIdTo))
        conn.commit()
        cur.close()
        conn.close()
        return createReturn(0, "Friend request sent.")
    return createReturn(1, "Username not in database")

def removeFriend(usernameFrom, usernameTo):
    if usernameInDB(usernameFrom) and usernameInDB(usernameTo):
        conn, cur = connect()
        userIdFrom = getUserId(usernameFrom)
        userIdTo = getUserId(usernameTo)
        sql = ('DELETE FROM userFriends WHERE (userId1 = %s AND userId2 = %s) AND accepted = 1'.format(conn))
        affected1 = cur.execute(sql, (userIdFrom, userIdTo))
        affected2 = cur.execute(sql, (userIdTo, userIdFrom))
        conn.commit()
        cur.close()
        conn.close()
        if affected1 + affected2 == 0:
            return createReturn(1, "Users are not friends. Cannot remove")
        return createReturn(0, "Friend removed")
    return createReturn(1, "Username not in database")

def acceptFriendRequest(usernameFrom, usernameTo):  # note: in this case, FROM is the person accepting. TO is the person being accepted. 
    if usernameInDB(usernameFrom) and usernameInDB(usernameTo):
        # check if a friend request has been sent. 
        lstRequests = getFriendRequestsHelper(usernameFrom)
        if lstRequests == False:
            return (1, "Username not in database")
        if usernameTo in lstRequests:
            # accept friend request. 
            userIdFrom = getUserId(usernameFrom)
            userIdTo = getUserId(usernameTo)
            conn, cur = connect()
            sql = ('UPDATE userFriends SET accepted = 1 WHERE userId1 = %s AND userId2 = %s'.format(conn))
            res = cur.execute(sql, (userIdTo, userIdFrom))
            conn.commit()
            cur.close()
            conn.close()    
            if res == 1:
                return createReturn(0, "Friend request accepted")
            return createReturn(-1, "Something failed in the database.")
        return createReturn(1, "No Friend Request had been sent to this person.")
    return createReturn(1, "Username not in database")

def declineFriendRequest(usernameFrom, usernameTo):
    if usernameInDB(usernameFrom) and usernameInDB(usernameTo):
        # check if a friend request has been sent. 
        lstRequests = getFriendRequestsHelper(usernameFrom)
        if lstRequests == False:
            return (1, "Username not in database")
        if usernameTo in lstRequests:
            # reject friend request. 
            userIdFrom = getUserId(usernameFrom)
            userIdTo = getUserId(usernameTo)
            conn, cur = connect()
            sql = ('DELETE FROM userFriends WHERE userId1 = %s AND userId2 = %s'.format(conn))
            res = cur.execute(sql, (userIdTo, userIdFrom))
            conn.commit()
            conn.close()
            cur.close()
            if res == 1:
                return createReturn(0, "Friend request declined")
            return createReturn(-1, "Something failed in the database.")

        return createReturn(1, "No Friend Request had been sent to this person.")
    return createReturn(1, "Username not in database")


def getFriendRequestsHelper(username):
    if usernameInDB(username):
        conn, cur = connect()
        userId = getUserId(username)
        sql = ('SELECT t.userUsername FROM userFriends as u, userAccounts as t WHERE u.userId2 = %s AND u.userId1 = t.userId AND u.accepted = 0'.format(conn))
        affected = cur.execute(sql, userId)
        listResults = cur.fetchall()
        lstRequests = [x[0] for x in listResults]
        blocked = getBlockedUsersHelper(username)
        finalLstRequests = []
        for username in lstRequests:
            if username not in blocked:
                finalLstRequests.append(username)
        # remove blocked ones
        cur.close()
        conn.close()
        return finalLstRequests
    return False

def getFriendRequests(username):
    lstResults = getFriendRequestsHelper(username)
    if lstResults == False:
        return createReturn(1, "Username not in database")
    return createReturn(0, lstResults)

def getBlockedUsers(username):
    blockedUsers = getBlockedUsersHelper(username)
    if blockedUsers == False:
        return createReturn(1, "Username not in database")
    return createReturn(0, blockedUsers)

def getBlockedUsersHelper(username):
    if usernameInDB(username):
        conn, cur = connect()
        userId = getUserId(username)
        sql = ('SELECT t.userUsername FROM userAccounts as t, userBlocks as b WHERE b.userIdFrom = %s AND b.userIdTo = t.userId AND b.blocked = 1'.format(conn))
        cur.execute(sql, userId)
        lstBlocked = [x[0] for x in cur.fetchall()]
        cur.close()
        conn.close()
        return lstBlocked
    return False

def blockUser(usernameFrom, usernameTo):
    if usernameInDB(usernameFrom) and usernameInDB(usernameTo):
        # check user is not already blocked
        if usernameTo in getBlockedUsersHelper(usernameFrom):
            return createReturn(1, "User had already been blocked")
        conn, cur = connect()
        userIdFrom = getUserId(usernameFrom)
        userIdTo = getUserId(usernameTo)
        sql = ('INSERT INTO userBlocks(userIdFrom, userIdTo, blocked) VALUES (%s, %s, 1)'.format(conn))
        cur.execute(sql, (userIdFrom, userIdTo))
        conn.commit()
        conn.close()
        cur.close()
        # remove friend
        if areFriends(usernameFrom, usernameTo):
            removeFriend(usernameFrom, usernameTo)
        return createReturn(0, "User blocked")
    return createReturn(1, "Username not in database")

def unblockUser(usernameFrom, usernameTo):
    if usernameInDB(usernameFrom) and usernameInDB(usernameTo):
        # check user is not already blocked
        if usernameTo not in getBlockedUsersHelper(usernameFrom):
            return createReturn(1, "User has not been blocked")
        conn, cur = connect()
        userIdFrom = getUserId(usernameFrom)
        userIdTo = getUserId(usernameTo)
        sql = ('DELETE FROM userBlocks WHERE userIdFrom = %s AND userIdTo = %s'.format(conn))
        cur.execute(sql, (userIdFrom, userIdTo))
        conn.commit()
        conn.close()
        cur.close()
        return createReturn(0, "User unblocked")
    return createReturn(1, "Username not in database")


def main(event, context):
    '''
    event format: 
    {
        function: 'changePassword'/'login'/'createUser/resetPassword'
        parameters: {'email': INSERT_EMAIL_GIVEN, 'old_password': INSERT_OLD_PASSWORD, 'new_password': INSERT_NEW_PASSWORD}/
                    {'email': INSERT_EMAIL_GIVEN, 'password': INSERT_PASSWORD}/
                    {'email': INSERT_EMAIL_GIVEN, 'password': INSERT_PASSWORD}, 'username': INSERT_USERNAME}/
                    {'email': INSERT_EMAIL_GIVEN}
    }
    '''
    
    fn = event['function']
    params = event['parameters']
    if fn == 'changePassword':
        if 'email' in params and 'old_password' in params and 'new_password' in params:
            # can call function
            return changePassword(params['email'], params['old_password'], params['new_password'])
        return {
            "code": 400,
            "msg": "changePassword: invalid parameters given. Must be: email, old_password/new_password"
        }
    if fn == 'login':
        if 'email' in params and 'password' in params:
            return login(params['email'], params['password'])
        return {
            "code": 400,
            "msg": "login: invalid parameters given. Must be: email, password"
        }
    if fn == 'createUser':
        if 'email' in params and 'password' in params and 'username' in params:
            return createUser(params['username'], params['password'], params['email'])
        return {
            "code": 400,
            "msg": "createUser:  invalid parameters given. Must be: username, email, password"
        }
    if fn == 'resetPassword':
        if 'email' in params:
            return resetPassword(params['email'])
        return {
            "code": 400,
            "msg": "resetPassword: invalid parameters given. Must be: email"
        }
    if fn == 'getFriends':
        if 'username' in params: 
            return getFriends(params['username'])
        return createReturn(400, "invalid parameters given")
    if fn == 'areFriends':
        if 'username1' in params and 'username2' in params: 
            return areFriends(params['username1'], params['username2'])
        return createReturn(400, "invalid parameters given")
    if fn == 'addFriend':
        if 'usernameFrom' in params and 'usernameTo': 
            return addFriend(params['usernameFrom'], params['usernameTo'])
        return createReturn(400, "invalid parameters given")
    if fn == 'removeFriend':
        if 'usernameFrom' in params and 'usernameTo': 
            return removeFriend(params['usernameFrom'], params['usernameTo'])
        return createReturn(400, "invalid parameters given")
    if fn == 'acceptFriendRequest':
        if 'usernameFrom' in params and 'usernameTo': 
            return acceptFriendRequest(params['usernameFrom'], params['usernameTo'])
        return createReturn(400, "invalid parameters given")
    if fn == 'declineFriendRequest':
        if 'usernameFrom' in params and 'usernameTo': 
            return declineFriendRequest(params['usernameFrom'], params['usernameTo'])
        return createReturn(400, "invalid parameters given")
    if fn == 'getFriendRequests':
        if 'username' in params: 
            return getFriendRequests(params['username'])
        return createReturn(400, "invalid parameters given")
    if fn == 'getBlockedUsers':
        if 'username' in params: 
            return getBlockedUsers(params['username'])
        return createReturn(400, "invalid parameters given")
    if fn == 'blockUser':
        if 'usernameFrom' in params and 'usernameTo': 
            return blockUser(params['usernameFrom'], params['usernameTo'])
        return createReturn(400, "invalid parameters given")
    if fn == 'unblockUser':
        if 'usernameFrom' in params and 'usernameTo': 
            return unblockUser(params['usernameFrom'], params['usernameTo'])
        return createReturn(400, "invalid parameters given")

    return createReturn(404, "invalid function given")
