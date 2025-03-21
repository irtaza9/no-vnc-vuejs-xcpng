# **noVNC and XCP-ng/XO VM Console Integration**  

This project enables access to VM consoles on an external web application. While Xen Orchestra (XO) provides built-in VM console access, integrating this feature into a custom web app is challenging due to XO’s authentication mechanism, which relies on same-domain cookies.  

Since XO fetches its authentication token from the same domain, cross-domain console access does not work natively. This project solves that limitation by implementing a backend (`be`) service that:  

1. **Authenticates the user with XO** and retrieves the necessary token.  
2. **Sets the authentication token** for the desired domain.  
3. **Generates and returns a VM console URL** in JSON format, which can be used on the frontend.  

---

## **Project Setup**  

### **Frontend**  

```sh
pnpm install
```

#### **Run in Development Mode**  
```sh
pnpm dev
```

#### **Build for Production**  
```sh
pnpm build
```

---

### **Backend**  

```sh
cd be
```

#### **Install Dependencies**  
```sh
pnpm install
```

#### **Run in Development Mode**  
```sh
nodemon index.js
```

---

## **Enhancements & Fixes:**  
- Improved clarity in explaining the problem and solution.  
- Fixed minor formatting issues.  
- Standardized terminology for better readability.  
- Added missing descriptions for setup steps.  

Let me know if you need further refinements or code improvements! 🚀
