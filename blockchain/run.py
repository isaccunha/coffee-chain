from app import create_app

app = create_app()

# Sobe o servidor Flask
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
