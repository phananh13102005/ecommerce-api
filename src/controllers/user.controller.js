export async function getMe(req, res) {
  const user = req.user;

  return res.status(200).json({
    success: true,
    data: {
      uid: user.uid,
      fullname: user.fullname,
      username: user.username,

      role: {
        roleid: user.role.roleid,
        rolename: user.role.rolename
      },

      membership: {
        mid: user.membership.mid,
        mname: user.membership.mname,
        score: user.membership.score
      }
    }
  });
}