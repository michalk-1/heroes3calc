import os
from pathlib import Path

from flask import (
    Flask,
    render_template,
    url_for,
    redirect,
    request,
    jsonify,
    send_from_directory,
)

from app.via import csv as via_csv


CREATURE_BANKS = {
    "black_tower": {},
    "crypt": {},
    "dragon_fly_hive": {},
    "dragon_utopia": {},
    "dwarven_treasury": {},
    "experimental_shop": {},
    "griffin_conservatory": {},
    "imp_cache": {},
    "mansion": {},
    "medusa_stores": {},
    "naga_bank": {},
    "red_tower": {
        "levels": [
            {"guards": [{"name": "green_dragon", "number": 1}]},
            {"guards": [{"name": "red_dragon", "number": 1}]},
            {"guards": [{"name": "gold_dragon", "number": 1}]},
            {"guards": [{"name": "black_dragon", "number": 1}]},
        ]
    },
    "wolf_raider_picket": {},
}


def create_app(test_config=None):
    # create and configure the app
    app = Flask(
        __name__, instance_relative_config=True, static_folder="a", template_folder="a",
    )

    app.config.from_mapping(
        SECRET_KEY="dev", DATABASE=os.path.join(app.instance_path, "flaskr.sqlite"),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route("/a/h3calc")
    def h3calc():
        return render_template("index.html")

    @app.route("/")
    def root():
        return redirect(url_for("h3calc"), code=302)

    allowed_queries = ("town", "name")

    @app.route("/d/list_of_creatures")
    def list_of_creatures():
        query = {
            key: value for key, value in request.args.items() if key in allowed_queries
        }
        return jsonify(via_csv.list_of_creatures(**query))

    @app.route("/favicon.ico")
    def favicon():
        return send_from_directory(
            app.root_path, "favicon.ico", mimetype="image/vnd.microsoft.icon"
        )

    @app.route("/images/banks")
    def banks_list():
        banks_path = Path(app.root_path) / "data" / "images" / "banks"
        xs = []
        for file_path in sorted(filter(lambda x: x.is_file(), banks_path.iterdir())):
            name = file_path.name.rsplit(file_path.suffix, 1)[0]
            o = {
                "name": name,
                "image": str(file_path.relative_to(app.root_path)),
            }
            g = CREATURE_BANKS[name]
            print(g)
            o.update(g)
            xs.append(o)

        return jsonify({"banks": xs})

    @app.route("/images/banks/<path:path>")
    def banks(path: str):
        return send_from_directory(
            os.path.join(app.root_path, "data/images/banks"), path
        )

    return app
