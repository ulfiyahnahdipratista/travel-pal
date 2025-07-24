from fastapi import FastAPI, Query
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import pickle
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


list_tipe_destinasi = ['Temple', 'Park', 'Mountain peak', 'Zoo', 'Tourist attraction',
       'Garden', 'Buddhist temple','Historical landmark', 'Hindu temple', 'Cake shop',
       'National reserve', 'Museum', 'Store', 'Art museum','Religious destination',
       'Livestock breeder', 'Souvenir store','Supermarket', 'Grocery store', 'Shopping mall', 
       'Nut store','Gift shop', 'Resort hotel', 'Tour agency', 'Ranch','District attorney', 
       'Tourist information center', 'Beach', 'Volcano', 'Mountain', 'Hiking area', 'Heritage preservation',
       'Place of worship', 'Nature preserve', 'Housing complex', 'City park', 'Deli', 'Business park', 
       'Orphanage', 'Shrine', 'Pastries', 'Natural goods store','Food store', 'Army museum', 
       'Recreation center','Theme park', 'Lake', 'History museum', 'Local history museum', 'Heritage museum',
       'Archaeological museum', 'Amusement park ride', 'Rail museum', 'Bakery', 'Greengrocer',
       'Research institute', 'Swimming basin', 'Gunung berapi', 'Puncak Gunung','Taman Rekreasi Air', 
       'Bangunan Bersejarah','Museum Angkatan Bersenjata', 'Museum Rel Kereta','Museum Sejarah Lokal', 
       'Pusat Perbelanjaan', 'Mal outlet', 'Hipermarket', 'Toko Mainan', 'Toko Pakaian', 'Toko Suvenir',
       'Pantai Umum', 'Pantai', 'Area Rekreasi Alam', 'Hutan Nasional', 'Cagar Alam']

#  Data input
class UserInput(BaseModel):
  user_survey : str
  
  
# load model
try:
  model = tf.saved_model.load("./models/model_recommendation")
  model_load = True
except Exception as e:
  print(f'Tidak berhasil load model : {e}')
  model = None
  model_load = False
  
# Load vocab
try: 
  with open('./models/vectorizer_user.pkl', 'rb') as f:
    vectorize_user = pickle.load(f)
  vectorize_user_load = True
    
  with open('./models/vectorizer_dest.pkl', 'rb') as f:
    vectorize_destinasi = pickle.load(f)
  vectorize_destinasi_load = True
except Exception as e:
  print(f'Tidak berhasil load vocab : {e}')
  vectorize_user = None
  vectorize_destinasi = None
  vectorize_user_load = False
  vectorize_destinasi_load = False

# Load data 
try:
  destinasi_data =pd.read_csv('./dataset_travel.csv')
  destinasi_data_load = True
except Exception as e:
  print(f'Tidak berhasil load data destinasi : {e}')
  destinasi_data_load = False
  
@app.get("/check-model")
def check_model():
  status = []
  if model_load:
    status.append('Model berhasil di load')
  else:
    status.append('Model gagal di load')
  if vectorize_user_load:
    status.append('Vocab user berhasil di load')
  else:
    status.append('Vocab user gagal di load')
  if vectorize_destinasi_load:
    status.append('Vocab destinasi berhasil di load')
  else:
    status.append('Vocab destinasi gagal di load')
  return {
    "status" : "ok" if model_load and vectorize_user_load and vectorize_destinasi_load else 'warning',
    "message" : status
  }
  
@app.post('/recommendation')
def recommendation(data : UserInput, max_recom : int = Query(5), treshold : float = Query(0.5)):

  if not (model_load and vectorize_destinasi_load and vectorize_user_load):
    return {"status" : "error", "message" : "Model atau vocab gagal load"}
  
  main_function = model.signatures['serving_default']
  user_input = data.user_survey
  destinasi_input = list_tipe_destinasi
  
  user_input_array = np.array([user_input] * len(destinasi_input), dtype=object)
  destinasi_input_array = np.array(destinasi_input, dtype=object)
  
  user_input_token = tf.cast(vectorize_user(user_input_array), tf.int32)
  destinasi_input_token = tf.cast(vectorize_destinasi(destinasi_input_array), tf.int32)
  
  output = main_function(user_preferensi=user_input_token, tipe_destinasi=destinasi_input_token)
  predictions = output[next(iter(output.keys()))].numpy()
  hasil = list(zip(destinasi_input, predictions))
  hasil_urut = sorted(hasil, key=lambda x: x[1], reverse=True)
  hasil_json = [
    {
        "tipe_destinasi": tipe_destinasi,
        "score": round(float(score), 2)
    }
    for tipe_destinasi, score in hasil_urut if score > treshold
    ][:max_recom]

# coba coba
  for rekom in hasil_json:
      tipe = rekom['tipe_destinasi']
      count = len(destinasi_data[destinasi_data['tipe'] == tipe])
      rekom["jumlah_data"] = count
  return {
    "status" : "success",
    "data": hasil_json    
  
  }
    
# uvicorn main:app --reload