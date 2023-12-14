# [Network](https://dj-network.onrender.com/)


This website is an implementation of social media, which gives user access to posting, following, and see posts only from their followings

## How to run this application
To run it on your computer you have clone this project from github and download django to your computer and open it on virtual enviroment after activating the virtual environment make sure your directory is in the same directory of manage.py. After that you can run the following command:

`pip install -r requirements.txt` to download all the neccessary libraries for this project

then open the following file  `project4/settings.py` after opening it comment out the following line of code  @ line 108

```
DATABASES = {
  'default': dj_database_url.config(
    default=os.getenv('DATABASE_URL')
  )
   
}
```

and remove the comment from @ line 94
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

next run the following command `py manage.py runserver` for windows`` python manage.py runserver` for  mac

after that you can open it based on the url that will be given below