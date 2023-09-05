from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Count
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import User, Post, Comment
from .forms import NewPost
from .helpers import *

def index(request):
    posts = Post.objects.all().order_by('-date')
   
    return render(request, "network/index.html", {
        "new_post": NewPost(),
        "posts": posts,
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]

        # Ensure all fields are filled
        if not username or not email or not first_name or not last_name:
            return render(request, "network/register.html", {
                "message": "Fill all the Fields."
            })
        if not username:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })


        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password, first_name=first_name, last_name=last_name)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@login_required(login_url="/login")
def addpost(request):
    # This should be get not post
    if request.method == "POST":
        form = NewPost(request.POST)

        if form.is_valid():
            post = form.cleaned_data["post"]
            print(post)
            Post.objects.create(user=request.user, post=post)
    

        print(request.user)

        return HttpResponseRedirect(reverse('index'))

def profile_page(request, username):

    user = User.objects.filter(username=username).first()
    if not user:
        ...
   
    follows = is_follower(username, request.user)
    print(follows)
    posts = user.poster.all().order_by('-date')

    return render(request, 'network/profilepage.html', {
        "User": user,
        "follows": follows,
        "posts": posts
    })


    return HttpResponseRedirect(reverse('index'))


@login_required(login_url="/login")
def following(request):
    # user = request.user
    user = request.user
    follows = user.following.all()
    posts = Post.objects.filter(user__in=follows).order_by('-date')
    # users = user.creator.all().first()
    # userss = users.follows.all()
    # posts = Post.objects.filter(user__in=userss).order_by('-date')

    
    return render(request, "network/index.html", {
        "new_post": NewPost(),
        "posts": posts,
    })
    # return HttpResponseRedirect(reverse('index'))
    
    
@login_required(login_url="/login")
def follow(request):
    return HttpResponse("Working on it.")
