from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)

def get_db_connection():
    return mysql.connector.connect(
        host="10.2.1.232",
        user="Rowe2007",
        password="Rowe2007",
        database="tictactoedb"
    )

@app.route("/")
def index_page():
    return render_template('index.html')

@app.route("/howto")
def how_page():
    return render_template('howto.html')

@app.route("/eksempel")
def eksempel_page():
    return render_template('eksempel.html')

@app.route("/get_scores", methods=["GET"])
def get_scores():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT player_x_wins, player_o_wins FROM scores LIMIT 1")
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    if result:
        return jsonify(result)
    else:
        return jsonify({"player_x_wins": 0, "player_o_wins": 0})

@app.route("/update_score", methods=["POST"])
def update_score():
    data = request.json
    winner = data.get("winner")

    conn = get_db_connection()
    cursor = conn.cursor()
    if winner == "X":
        cursor.execute("UPDATE scores SET player_x_wins = player_x_wins + 1 WHERE id = 1")
    elif winner == "O":
        cursor.execute("UPDATE scores SET player_o_wins = player_o_wins + 1 WHERE id = 1")
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"status": "success"})

if __name__ == "__main__":

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT IGNORE INTO scores (id, player_x_wins, player_o_wins) VALUES (1, 0, 0)")
    conn.commit()
    cursor.close()
    conn.close()

    app.run(debug=True)