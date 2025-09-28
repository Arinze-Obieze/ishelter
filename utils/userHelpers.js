export const getInitials = (user) => {
    if (user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return user.email.slice(0, 2).toUpperCase()
  }
  
  export const getStatus = (user) => {
    if (user.status) return user.status
    
    if (!user.lastLogin) return "Inactive"
    
    const lastLogin = user.lastLogin.toDate()
    const daysSinceLogin = Math.floor((new Date() - lastLogin) / (1000 * 60 * 60 * 24))
    
    if (daysSinceLogin <= 7) return "Active"
    if (daysSinceLogin <= 30) return "Inactive"
    return "Suspended"
  }
  
  export const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-blue-100 text-blue-700"
      case "success manager":
      case "successmanager":
        return "bg-green-100 text-green-700"
      case "client":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }
  
  export const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700"
      case "Inactive":
        return "bg-gray-100 text-gray-500"
      case "Suspended":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }
  
  export async function addUser({ email, fullName, role = "user" }) {
    // 1. Create account
    const createRes = await fetch("/api/create-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const createData = await createRes.json();
    if (!createRes.ok || !createData.success) {
      throw new Error(createData.error || "Failed to create user account");
    }
  
    // 2. Send email with credentials
    const subject = "Your iSHELTER Account Details";
    const message = `Hello ${fullName || email},<br><br>Your account has been created.<br>Email: <b>${email}</b><br>Password: <b>${createData.password}</b><br><br>Please log in and change your password.`;
    const sendEmailRes = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject,
        message,
        name: fullName || email,
      }),
    });
    const sendEmailData = await sendEmailRes.json();
    if (!sendEmailRes.ok || !sendEmailData.success) {
      throw new Error(sendEmailData.error || "Failed to send email");
    }
  
    // 3. Optionally: Add user to Firestore with role
    // (If needed, you can add Firestore logic here)
  
    return { email, password: createData.password };
  }