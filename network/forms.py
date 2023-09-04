from django import forms


class NewPost(forms.Form):
    post = forms.CharField(widget=forms.Textarea(attrs={"placeholder":"Something To Share?", "id":"text-post" , "rows": "5"}))
    