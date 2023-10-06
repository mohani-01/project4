from .models import *

def is_follower(profileowner, user):
    if not user.is_authenticated:
        return False
    if User.objects.filter(username=profileowner, followers=user).first():
        return True
    return False