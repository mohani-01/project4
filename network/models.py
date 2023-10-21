from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField("self", blank=True, symmetrical=False, related_name="following")
    
    
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commenter')
    comment = models.TextField()
    time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-time']
        
    def serialize(self, post):
        return {
            "user": self.user.username,
            "name" : f"{self.user.first_name} {self.user.last_name}",
            "comment": self.comment,
            "time": self.time.strftime("%b %d %Y, %I:%M %p"),
            "number" : post.comment.all().count()
        }

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='poster')
    post = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    like = models.ManyToManyField(User, blank=True, related_name='like')
    comment = models.ManyToManyField(Comment, blank=True, related_name="post")

    
