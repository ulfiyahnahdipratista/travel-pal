# API Spesification Travel Pal

## Get List Destinasi By Tipe

method : GET

endpoint : `/destinasi`

Headers : 
- Content-Type : `application/json`
- Authorization : `Bearer <JWT_TOKEN>`

body : 
```JSON
{
  "tipe" : ["sejarah dan budaya", "petualangan"],
  "limit" : 5
}
``` 

response :
```JSON
{
  "status" : "success",
  "message" : "Destinasi dengan tipe ${tipe} berhasil di dapat",
  "data" : [
    {
      // data yg ada di db
    }
  ]
}
```

> ### CASE 1
> rekomendasi yang di hasilkan sesuai dengan limit yang di inputkan, jika 8 maka harus ada 8 destinasi yang di tampilkan.
>
> jika tipe rekomendasinya kurang dari 8 destinasi maka akan mengambil secara random kategori dari tipe yang di 



---


## Get Details Destinasi By id

method : GET

endpoint : `/destinasi`

query : `/?id=1`

Headers : 
- Content-Type : `application/json`
- Authorization : `Bearer <JWT_TOKEN>`

response :
```JSON
{
  "status" : "success",
  "message" : "Destinasi dengan id ${id} berhasil di dapat",
  "data" : {
    // data yg ada di db
  }
}
```

---

## Get Kuliner By Kabupaten

method : GET

endpoint : `/destinasi`

query : `/?kabupaten=malang`

Headers : 
- Content-Type : `application/json`
- Authorization : `Bearer <JWT_TOKEN>`


response :
```JSON
{
  "status" : "success",
  "message" : "Kuliner dengan kabupaten ${kabupaten} berhasil di dapat",
  "data" : [
    {
      // data yg ada di db
    }
  ]
}
```

---
## Get Details Kuliner By id

method : GET

endpoint : `/destinasi`

query : `/?id=1`

Headers : 
- Content-Type : `application/json`
- Authorization : `Bearer <JWT_TOKEN>`

response :
```JSON
{
  "status" : "success",
  "message" : "Kuliner dengan id ${id} berhasil di dapat",
  "data" : [
    {
      // data yg ada di db
    }
  ]
}
```

---

```json
backend/
  prisma
  src/
    controller/
    plugins/
    routes/
    service/
    index.js
  env.
```