function mapUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    hourlyRate: user.hourlyRate || 0,
    createdAt: user.createdAt,
  };
}

module.exports = mapUser;
