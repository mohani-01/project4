from django import forms


class NewPost(forms.Form):
    post = forms.CharField(widget=forms.Textarea(attrs={"title":"Something To Share", "placeholder":"Something To Share?", "id":"text-post" , "rows": "5"}))
    