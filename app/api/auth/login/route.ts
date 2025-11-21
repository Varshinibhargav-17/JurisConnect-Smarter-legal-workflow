const safeUser = {
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
};
return NextResponse.json({ user: safeUser });
