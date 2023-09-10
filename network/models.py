from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField("self", blank=True)
    followers = models.ManyToManyField("self", blank=True)

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commenter')
    comment = models.TextField()
    time = models.DateTimeField(auto_now_add=True)
# class Like(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='like')

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='poster')
    post = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    like = models.ManyToManyField(User, blank=True, related_name='like')
    views = models.IntegerField(default=0)
    comment = models.ManyToManyField(Comment, blank=True, related_name="post")


# class Following(models.Model):
#     user = models.ForeignKey(User, unique=True, on_delete=models.CASCADE, related_name="creator")
#     follows = models.ManyToManyField(User, blank=True, related_name="following")
#     followers = models.ManyToManyField(User, blank=True, related_name="follows")