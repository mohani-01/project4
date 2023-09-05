
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("addpost", views.addpost , name="addpost"),
    path("follow", views.follow, name="follow"),
    path("following", views.following, name="following"),
    path("user/<str:username>", views.profile_page, name="profile_page"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
