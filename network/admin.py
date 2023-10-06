from django.contrib import admin
from .models import *

# Register your models here.
class PostAdmin(admin.ModelAdmin):
    list_display = ("user", "post", "date")
    filter_horizontal = ("comment","like")

class CommentAdmin(admin.ModelAdmin):
    list_display = ("user", "comment", "time")

class UserAdmin(admin.ModelAdmin):
    filter_horizontal = ("followers",)

admin.site.register(Comment, CommentAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(User, UserAdmin)
