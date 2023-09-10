from .models import *

def is_follower(username, user):
    if not user.is_authenticated:
        return False
    if User.objects.filter(username=username, followers=user).first():
        return True
    return False