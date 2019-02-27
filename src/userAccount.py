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


def createUser(username, password, email):
    email = email.lower()
    # sensitize data. return (-1 for non unique email)
    if emailInDB(email):
        print("An account has already been created with this email address. Try logging in.")
        msg = "Email exists"
        return False
    # else, create new user.
    hashed_password = hashSHA256(password)
    # print("The hashedpass is: %s", hashed_password)
    conn = pymysql.connect(host='slackoverflowdb.cyy8oalnodc0.ca-central-1.rds.amazonaws.com', port=3306, user='admin',
                           passwd='adminadmin', db='mysql')
    cur = conn.cursor()
    cur.execute("USE slackoverflowDB")
    sql = ('INSERT INTO userAccounts(userUsername, userPassword, userEmail) VALUES (%s, UNHEX(%s), %s)'.format(conn))
    # print("Successfully connected to database.")
    ret = cur.execute(sql, (username, hashed_password, email))

    # print(cur.rowcount)
    # print(cur.fetchall())
    if ret == 1:
        print("User successfully added to the table. Congratulations!")
        sendConfirmationEmail(username, email)
        msg = "Success"
    else:
        print("For some reason the user could not be added to the table. Check database manually.")
        msg = "Failure"
    conn.commit()
    cur.close()
    conn.close()
    return True
    # return {
    #    'StatusCode': 200,
    #    'body': json.dumps(msg)
    # }


def emailInDB(email):
    conn = pymysql.connect(host='slackoverflowdb.cyy8oalnodc0.ca-central-1.rds.amazonaws.com', port=3306, user='admin',
                           passwd='adminadmin', db='mysql')
    cur = conn.cursor()
    cur.execute("USE slackoverflowDB")
    sql = ('SELECT * FROM userAccounts WHERE userEmail = %s'.format(conn))
    # print("Successfully connected to database.")
    ret = cur.execute(sql, email)
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
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])


def hashSHA256(password):
    hash_object = hashlib.sha256(password.encode())
    return hash_object.hexdigest()


def resetPassword(email):
    # make sure email is in DB
    email = email.lower()
    newPass = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
    # print("The new password will be: ", newPass)
    # insert the new password into the database
    if not emailInDB:
        return False
    username = getUsername(email)
    hashed_password = hashSHA256(newPass)
    conn = pymysql.connect(host='slackoverflowdb.cyy8oalnodc0.ca-central-1.rds.amazonaws.com', port=3306, user='admin',
                           passwd='adminadmin', db='mysql')
    cur = conn.cursor()
    cur.execute("USE slackoverflowDB")
    sql = ('UPDATE userAccounts SET userPassword = UNHEX(%s) WHERE userEmail = %s'.format(conn))
    rows_affected = cur.execute(sql, (hashed_password, email))
    conn.commit()
    cur.close()
    conn.close()
    sendPasswordResetEmail(username, email, newPass)
    if rows_affected > 0:
        return True
    return False
    # print("Successfully updated database's password")
    # print("New pass hashed is: ", hashed_password)

    # return "Success"


def getUsername(email):
    conn = pymysql.connect(host='slackoverflowdb.cyy8oalnodc0.ca-central-1.rds.amazonaws.com', port=3306, user='admin',
                           passwd='adminadmin', db='mysql')
    cur = conn.cursor()
    cur.execute("USE slackoverflowDB")
    sql = ('SELECT userUsername FROM userAccounts WHERE userEmail = %s'.format(conn))
    # cur.execute(sql, (hashed_password, email))
    ret = cur.execute(sql, email)
    t = cur.fetchone()
    cur.close()
    conn.close()
    return t[0]


def sendPasswordResetEmail(username, email, password):
    recipient = email
    subject = "OurUTM Account Password Reset"
    body_text = (
                "OurUTM Account Password Reset\r\nHey " + username + "! It seems like you requested a password reset for your OurUTM account. The password has been temporarily set to " + password + ". \r\nYou can use this email address and the given password to log in to your account, and from there you can change your password.")
    body_html = "<html><head></head><body><h1>OurUTM Account Password Reset</h1><p>Hey " + username + "! It seems like you requested a password reset for your OurUTM account. The password has been temporarily set to <b>" + password + "<b>. <br>"
    "You can use this email address and the given password to log in to your account, and from there you can change your password.</p></body></html"

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
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])


def login(email, password):
    # 1 hash password, format email
    email = email.lower()
    hashed_password = hashSHA256(password)
    # 2 check in database if match.
    conn = pymysql.connect(host='slackoverflowdb.cyy8oalnodc0.ca-central-1.rds.amazonaws.com', port=3306, user='admin',
                           passwd='adminadmin', db='mysql')
    cur = conn.cursor()
    cur.execute("USE slackoverflowDB")
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
        return True
    else:
        print("The email and password don't seem to match")
        return False


def changePassword(email, old_password, new_password):
    # hash both
    hashed_old = hashSHA256(old_password)
    hashed_new = hashSHA256(new_password)
    email = email.lower()

    # check db record whether user is logged in AND old password is correct
    conn = pymysql.connect(host='slackoverflowdb.cyy8oalnodc0.ca-central-1.rds.amazonaws.com', port=3306, user='admin',
                           passwd='adminadmin', db='mysql')
    cur = conn.cursor()
    cur.execute("USE slackoverflowDB")
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


def main(event, context):
    # testing purposes:
    email = "amy.ch1000@gmail.com"
    # return login(email, "insert emailed password")
    print("* CASE 1: ADDING USER")
    r1 = createUser("Amy", "Amy1", email)
    createUser("Not Amy", "Not Amy1", "amymichellechung@gmail.com")
    if r1:
        print("CASE 1 successful")
    # should be successful
    print("* CASE 2: FAILED CASE. ADD USER WITH SAME PASSWORD")
    r2 = createUser("Jacky", "Jacky1", email)
    if not r2:
        print("CASE 2 failed successfully")
    print("* CASE 3: LOGGING IN WITH INCORRECT PASSWORD")
    r3 = login(email, "NotThisPassword")
    if not r3:
        print("CASE 3 failed successfully")
    print("* CASE 4: LOGGING IN WITH CORRECT PASSWORD")
    r4 = login(email, "Amy1")
    if r4:
        print("CASE 4 successful")
    print("* CASE 5: GENERATING DEFAULT PASSWORD")
    r5 = resetPassword(email)
    if r5:
        print("CASE 5 successful")

    print("* CASE 7: CHANGE PASSWORD WHILE NOT LOGGED IN")
    r7 = changePassword('amymichellechung@gmail.com', 'Not Amy1', "ActuallyAmy")
    if not r7:
        print("CASE 7 failed successfully")
    # show db with updated password
    print("* CASE 6: CHANGE PASSWORD WHILE LOGGED IN")
    r6 = changePassword(email, "Ry3P3o", "swag")
    if r6:
        print("CASE 6 successful")
    return True
