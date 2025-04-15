from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

# Sample sentences for typing
SENTENCES = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "Sphinx of black quartz, judge my vow.",
    "Waltz, nymph, for quick jigs vex Bud."
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sentence')
def get_sentence():
    sentence = random.choice(SENTENCES)
    return jsonify({'sentence': sentence})

if __name__ == '__main__':
    app.run(debug=True)
