# Blogchain

Blogchain is a Medium-style platform focused on articles about Blockchain technology. Built with Next.js for the frontend and NestJS for the backend, this project offers a full-featured blogging platform with social authentication and rich text editing.

## Installation

1. **Clone the repository**:

    ```
    git clone https://github.com/sensitiky/blogchain.git
    cd blogchain
    ```
    
2. **Set up environment variables**:

Create a .env file in the root directories of both the frontend and backend, and add the following variables:

**Backend `(.env)`:**

    FACEBOOK_CLIENT_ID=your_facebook_client_id
    FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
    JWT_SECRET=your_jwt_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    MAIL_USER=your_mail_user
    MAIL_PASS=your_mail_pass
    DB_HOST=your_db_host
    DB_PORT=your_db_port
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password
    DB_DATABASE=your_db_name
    GOOGLE_CALLBACK_URL=your_google_callback_url
    DB_SSL=your_db_ssl_setting

**Frontend `(.env.local)`:**

    NEXT_PUBLIC_API_URL_PROD=https://api.yourdomain.com
    NEXT_PUBLIC_API_URL_DEV=http://localhost:4000
    NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

3. **Install dependencies**:

    ```
    npm install

4. **Run the development server**:
    
    ```
    npm run dev
---

## Features

- **User Authentication:** Login via Google.
- **Rich Text Editor:** Create and edit articles with rich editor created from scratch.
- **Responsive Design:** Fully responsive UI for all devices.
---
## Technologies

- **Frontend:** Next.js, React
- **Backend:** NestJS, PostgreSQL
- **Authentication:** JWT, OAuth (Google, Facebook)
- **Styling:** Tailwind CSS
- **Rich Text Editor:** From scratch
---
## Deployment
- **Production URL:** https://blogchain.tech
- **API** https://api.blogchain.tech
---
### Contributing

- Feel free to fork this repository and contribute by submitting a pull request.

---

### License

This project is licensed under the MIT License.

