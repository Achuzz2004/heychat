from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile
from .serializers import ProfileSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if not username or not password:
            return Response({"detail": "username and password required"}, status=400)
        if Profile.objects.filter(username=username).exists():
            return Response({"detail": "username taken"}, status=400)
        user = User.objects.create_user(username=username, password=password)
        Profile.objects.create(user=user, username=username)
        refresh = RefreshToken.for_user(user)
        return Response({"access": str(refresh.access_token), "refresh": str(refresh)})

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        u = authenticate(username=username, password=password)
        if not u:
            return Response({"detail": "invalid credentials"}, status=400)
        refresh = RefreshToken.for_user(u)
        return Response({"access": str(refresh.access_token), "refresh": str(refresh)})

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        p = Profile.objects.get(user=request.user)
        data = ProfileSerializer(p).data
        data.update({"id": str(request.user.id)})
        return Response(data)

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        p = Profile.objects.get(user=request.user)
        p.username = request.data.get("username", p.username)
        p.about = request.data.get("about", p.about)
        if request.FILES.get("avatar"):
            p.avatar = request.FILES["avatar"]
        p.save()
        return Response(ProfileSerializer(p).data)
