import json

PROF_FILE = "RMPProfs.json" # will be using DB

def rateMyProf(profName):
    # check format of profName input
    profName = profName.upper()
    rev = profName.split(' ')
    rev.reverse()
    profName = profName.replace(',', '')
    profNames = [profName, ' '.join(rev), profName.replace(',', '')]

    # store previous information in a JSON file
    with open(PROF_FILE, 'r') as f:
        prof_json = json.load(f)
    # check file
    # see if prof already in file
    for prof in prof_json['items']:
        if prof['name'] in profNames:
            # prof in file
            return prof

    # otherwise, prof is not in file
    seleniumProf(profName)



def seleniumProf(profName):
    driver = webdriver.Firefox()
    #driver = webdriver.Firefox("https://www.ratemyprofessors.com")
    driver.get("https://www.ratemyprofessors.com")
    search_id = "searchr"
    assert "Rate" in driver.title
    elem = driver.find_element_by_id(search_id)
    elem.send_keys("profName")
    elem.send_keys(Keys.RETURN)
    print("HERE")


def readProfData(prof_d, selectedCourse=None):
    course_info = {}
    dep = prof_d['department']
    s_course = ""

    if selectedCourse and len(selectedCourse) > 3:
        selectedCourse = selectedCourse[3:6]

    if selectedCourse:
        for course in prof_d['courses']:
            if course['course'] == selectedCourse:
                course_info['number_ratings'] = course['number_ratings']
                course_info['most_recent'] = course['most_recent']
        if not course_info:
            s_course = "\tNo ratings available for {0}{1}\n".format(dep, selectedCourse)
        else:
            s_course = "\t {0}{1}: {2} ratings given (most recent on {3})\n".format(dep, selectedCourse, course_info['number_ratings'], course_info['most_recent'])
    else:
        for course in prof_d['courses']:
            s_course += "\t {0}{1}: {2} ratings given (most recent on {3})\n".format(dep, course['course'], course['number_ratings'], course['most_recent'])

    s = "{0}\n" \
        "Course Information: \n{1}" \
        "Average student rating: {2}\n".format(prof_d['name'], s_course, prof_d['quality'])

    return s
