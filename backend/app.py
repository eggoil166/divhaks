from flask import Flask, Response
import cv2
import random

app = Flask(__name__)

def get_webcam():
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success:
            break
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    cap.release()

@app.route('/videofeed')
def videofeed():
    return (Response(get_webcam(), mimetype='multipart/x-mixed-replace; boundary=frame'))

@app.route('/points')
def points(): #maybe this is polled every 5 seconds for points? 2.5?
    return random.randint(0,100)

@app.route('/')
def index():
    return "on"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)