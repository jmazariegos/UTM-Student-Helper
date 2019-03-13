from selenium import webdriver
from selenium.webdriver.common.by import By 
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC 
from selenium.common.exceptions import TimeoutException
import time as t
import json

bypass = True
current_folder = 'chromedriver' #must be changed to path of chromedriver.exe
JSONname = '../../../data/courses.json'

def scrape_courses(criteria, session):
    if(session.lower().startswith('fall') or session.lower().startswith('winter')):
        session = '20189'
    elif('summer' in session.lower()):
        session = '20195'
    else:
        print("No valid session found within text");
        return
    
    #options that will make the browser invisible
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  
    options.add_argument("--window-size=%s" % '1920,1080')
    browser = webdriver.Chrome(executable_path=current_folder, chrome_options=options)
    browser.get('https://student.utm.utoronto.ca/timetable/index.php?session='+session+'&course='+criteria)
    t.sleep(5) #waits for page to load, theres a wait until func but the page will load different elements depending on if the criteria exists or not and i am too
    #lazy to figure a way for that right now

    #in case criteria meets nothing
    if 'No matching courses' in browser.page_source:
        #print("No courses found")
        browser.quit()
        return

    courses = browser.find_elements_by_xpath('//div[contains(@id, \''+criteria.upper()+'\')]/span') #find div id that contains the criteria
    course_descs = browser.find_elements_by_xpath('//div[@class=\'alert alert-info infoCourseDetails infoCourse\']') #gives the descs
    try:
        JSONfile = open(JSONname, 'r')
        course_database = json.loads(JSONfile.read())
        JSONfile.close()
    except:
        course_database = {}
        
    for course, desc in zip(courses,course_descs): #each title and desc is obtained in the same order
        if course.text[:6] in course_database.keys():
            continue
        rows = browser.find_elements_by_xpath('//tr[contains(@id, \''+course.text[:9].upper()+'\')]') #gets the rows for this specific course
        course_dict = {}
        course_dict['code'] = course.text[:8]
        course_dict['session'] = 'fall/winter' if session == '20189' else 'summer'
        course_dict['semester'] = course.text[8]
        bracket = course.text.find('(')
        course_dict['name'] = course.text[12:bracket-1 if bracket != -1 else 0]
        course_dict['description'] = desc.text[:desc.text.find('\n')]
        course_dict['lectures'] = []
        course_dict['tutorials'] = []
        course_dict['practicals'] = []
        for row in rows:
            cells = row.find_elements_by_tag_name("td") #get the cells of this rows
            if len(cells) < 13:
                continue
            section = {'section': cells[1].text[3:], 'instructor': cells[2].text, 'timings': []}
            if cells[7].text.count('\n') > 1:
                days = cells[7].text.split('\n')
                starts = cells[8].text.split('\n')
                ends = cells[9].text.split('\n')
                for day, start, end in zip(days, starts, ends):
                    section['timings'].append([day, start, end])
            else:
                    section['timings'].append([cells[7].text, cells[8].text, cells[9].text])
            if cells[1].text.startswith('LEC'):
                course_dict['lectures'].append(section)
            elif cells[1].text.startswith('TUT'):
                course_dict['tutorials'].append(section)
            else:
                course_dict['practicals'].append(section)
        course_database[course_dict['code'] + course_dict['semester'] + course_dict['session'][0]] = course_dict
    browser.quit() #:)
    JSONfile = open(JSONname, 'w+')
    JSONfile.write(json.dumps(course_database, indent=4))
    JSONfile.close()


def list_courses(criteria, session, semester):
    JSONfile = open(JSONname, 'r')
    course_database = json.loads(JSONfile.read())
    JSONfile.close()
    semester = semester.upper()
    session = session.lower()
    criteria = criteria[:6].upper()
    for course in course_database:
        details = course_database[course]
        if criteria in details['code']:
            if (details['semester'] == semester or details['semester'] == 'Y') and session in details['session']:
                print(details['code'] + ' - ' + details['name'] + '\n' + details['description'] + '\n')

if bypass:
    programs = ['ANT', 'AST', 'BIO', 'HSC', 'CHM', 'CIN', 'CLA', 'CCT', 'CSC', 'CTE', 'DTS', 'DRE', 'ERS', 'ECO', 'EDS', 'ENG', 'ENV', 'ERI', 'FAH', 'VST', 'FAS', 'FSC', 'PSY', 'FSL', 'FRE', 'LTL', 'GGR', 'HHS', 'JEG', 'JGE', 'HIS', 'RLG', 'IMI', 'ITA', 'GER', 'LAT', 'SPA', 'CHI', 'FGI', 'PRS', 'ARA', 'HIN', 'URD', 'SAN', 'LIN', 'JAL', 'MGM', 'MAT', 'MGT', 'PHL', 'PHY', 'JCP', 'JCB', 'POL', 'JPE', 'JEP', 'WRI', 'SOC', 'STA', 'UTM', 'VCC', 'WGS']
    for program in programs:
        scrape_courses(program, 'fall')
        scrape_courses(program, 'summer')
