
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("addpost", views.addpost , name="addpost"),
    path("editpost/<int:post_id>", views.editpost, name="editpost"),
    path("follow/<int:user_id>", views.follow, name="follow"),
    path("following", views.following, name="following"),
    path("comment/<int:post_id>", views.comment, name='comment'),
    path("user/@<str:username>", views.profile_page, name="profile_page"),
    path("like/<int:post_id>", views.like, name="like"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]

# add at the last
urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
