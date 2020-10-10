import time
import random
import pandas as pd

while True:
    df = pd.read_json("./hexids.json")
    df["count"] = random.sample(range(1, 700), df.shape[0])
    result = df.to_json("hexids.json", orient="records")
    time.sleep(3)
