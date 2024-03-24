# THIS FILE IS ONLY FOR TESTING PURPOSES TO MAKE SURE FLASK HAS BEEN INSTALLED DO NOT DEVELOP IN THIS FILE

from flask import Flask #you can set up a vritual enviroment if you want to deal with project dependacies ask Joseph for more details 

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, Flask!'
#DO NOT DEVELOP IN THIS FILE

if __name__ == '__main__':
    app.run(debug=True)