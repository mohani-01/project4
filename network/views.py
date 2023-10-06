import json
from django.core.paginator import Paginator
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Count
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt 
from .models import User, Post, Comment
from .forms import NewPost
from .helpers import *

def index(request):
    
    # paginate all the posts based on date , 10 posts each
    p = Paginator(Post.objects.all().order_by('-date'), 10)


    # get a paginated posts based on the number given
    page = request.GET.get("page")
    posts = p.get_page(page)

    return render(request, "network/index.html", {
        "new_post": NewPost(),
        "posts": posts,
    })


@login_required(login_url="/login")
def addpost(request):

    # Via method Post
    if request.method == "POST":
        form = NewPost(request.POST)

        # create new post and return to index page
        if form.is_valid():

            post = form.cleaned_data["post"]
            Post.objects.create(user=request.user, post=post)

        return HttpResponseRedirect(reverse('index'))

    

@login_required(login_url="/login")
def editpost(request, post_id):

    if request.method != "PUT":
        return JsonResponse({"error": "Method not allowed"}, status=405)


    # check if the post exist
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error" : "Post not found."}, status=404)


    # check if the user is the same as the editor
    if post.user != request.user:
        return JsonResponse({"error": "Your are not authorized to edit this post."}, status=401)

    # load the element of json and return error if the post field doesn't exist
    data = json.loads(request.body)

    if not data.get("post"):
        return JsonResponse({"error": "Cannot find edit field."}, status=422)

    # save the data
    post.post = data["post"].strip()
    post.save()

    return JsonResponse({"success": "Post is edited successfully."}, status=201)



def profile_page(request, username):

    user = User.objects.filter(username=username).first()

    # check if the user is follower of the user
    follows = is_follower(username, request.user)

    # paginate the page
    p = Paginator(user.poster.all().order_by('-date'), 10)
    page = request.GET.get("page")
    posts = p.get_page(page)

    # return the Profile page of the User with posts he/she posts before
    return render(request, 'network/profilepage.html', {
        "User": user,
        "follows": follows,
        "posts": posts
    })



# following page
@login_required(login_url="/login")
def following(request):
    
    user = request.user
    # get all people the user followis
    follows = user.following.all()

    # check if the user follow atleast one person 
    does_follow = follows.count()

    # paginate the posts that the user follows
    p = Paginator(Post.objects.filter(user__in=follows).order_by('-date'), 10)

    # get the page number
    page = request.GET.get("page")
    posts = p.get_page(page)

    # user_follow is to tell that this page is /following page for the template in html to handle {% empty %} in {% for loop %} 
    return render(request, "network/index.html", {
        "new_post": NewPost(),
        "posts": posts,
        "user_follow": True,
        "does_follow": does_follow
    })

    

@login_required(login_url="/login")
def follow(request, user_id):
    if request.method == "POST":


        # get the user to be followed
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            messages.error(request, "User Don't exist")
            return HttpResponseRedirect(reverse('index'))

        # check if the user is trying to follow itself (:)
        if user == request.user:
            messages.error(request,"Your Can't follow Yourself!")
            return HttpResponseRedirect(reverse('index'))

        # unfollow the user
        if user.followers.contains(request.user):
            user.followers.remove(request.user)

        # follow the user
        else:
            user.followers.add(request.user)

        # return back
        return HttpResponseRedirect(reverse('profile_page', args=(user.username,)))

   


@login_required(login_url='/login')
def like(request, post_id):

    if request.method != 'PUT':
        return JsonResponse({"error": "Method not found!"}, status=405)

    # Get the post
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found!"}, status=404)


    # remove the user from the like list
    if post.like.contains(request.user):
        post.like.remove(request.user)
        post.save()
        
        # count all the likes
        like = post.like.all().count()

        # return message, no of like and boolean expression
        return JsonResponse({"success": f"{request.user} Liked post by { post.user }",
                            "like": like,
                            "liked" : False })

    # add the user into the like list
    else:
        post.like.add(request.user)
        post.save()
        
        # count all the likes
        like = post.like.all().count()

        # return message, no of like and boolean expression
        return JsonResponse({"success": f"{request.user} UnLiked a post by { post.user }",
                            "like": like,
                            "liked" : True })


@login_required(login_url="/login")
def comment(request, post_id):
    if request.method != "POST":
        return JsonResponse({"error" : "Method not allowed"}, 405)


    user = request.user
    
    # get the comment body
    data = json.loads(request.body)

    if not data.get("comment"):
        return JsonResponse({"error" : "Cannot find a comment"}, status=422)
    
    # check if the post exist
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found"}, status=404)

    # save the coomment 
    comment = data["comment"].strip()
    comment = Comment(user=user, comment=comment)
    comment.save()

    # add the comment inside the post
    post.comment.add(comment)
    post.save()

    return JsonResponse(comment.serialize(post), status=201 )

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
    # Via POST 
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

    # Via not POST ~ GET
    else:
        return render(request, "network/register.html")

