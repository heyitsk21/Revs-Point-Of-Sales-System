from flask import Flask #you can set up a vritual enviroment if you want to deal with project dependacies ask Joseph for more details 

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, Flask!'

if __name__ == '__main__':
    app.run(debug=True)