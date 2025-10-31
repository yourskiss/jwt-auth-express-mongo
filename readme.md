<h3>🧾 Project Overview</h3>
<p>This web application is a secure and scalable user management system built with Express.js, MongoDB Atlas, and Mongoose, following the MVC (Model-View-Controller) architecture. It features robust authentication, role-based access control, session management, and user-friendly CRUD operations.
<br />
The app is designed with a focus on security, maintainability, and user experience. It includes critical functionality like email-based OTP verification, password reset, image upload and processing, and soft deletion (activate/deactivate users).</p>


This web application is a secure and scalable user management system built with Express.js, MongoDB Atlas, and Mongoose, following the MVC (Model-View-Controller) architecture.
It features robust authentication, role-based access control, session management, and user-friendly CRUD operations.

The app is designed with a focus on security, maintainability, and user experience. It includes key functionality such as email-based OTP verification, password reset, image upload and processing, and soft deletion (activate/deactivate users).
 
<h3>🔐 Authentication</h3>
<ul> 
<li><strong>Access Token:</strong>
Short-lived JWT used for authenticating API requests. Automatically attached via secure HTTP-only cookies to prevent XSS attacks.</li>
<li><strong>Refresh Token:</strong>
Long-lived JWT used to re-authenticate users without re-entering credentials.
Stored securely in HTTP-only cookies and persisted in the Token collection in MongoDB for validation and revocation control.</li>
<li><strong>Multi-Device Login Support:</strong>
Each login on a new device or browser generates a unique refresh token entry in the token collection, allowing users to stay signed in on multiple devices independently.</li>
<li><strong>Automatic Token Renewal:</strong>
When an access token expires, the refresh token is used to obtain a new one without requiring the user to log in again.</li>
<li><strong>Secure Logout:</strong>
On logout, the corresponding refresh token is deleted from the token collection and cookie cleared from the client.</li>
<li><strong>Email & Password Login:</strong>
Secure credential handling with bcrypt password hashing.</li>
<li><strong>Email OTP Verification:</strong>
Enforced during user registration and password reset workflows for enhanced account security.</li>
<li><strong>Secure Routing:</strong>
Custom middleware validates access tokens and protects sensitive routes and resources.</li>
<li><strong>Role-Based Access Control (RBAC):</strong>
Fine-grained access management for user, admin, and superadmin roles.</li>
</ul>

<h3>👤 User Management</h3>
<ul>
<li><strong>User Registration:</strong> Sign up with email-based OTP verification to ensure valid user identities</li> 
<li><strong>Secure Login:</strong> Session-based authentication with encrypted credentials</li> 
<li><strong>Forgot Password:</strong> Password reset workflow using OTP sent via email</li> 
<li><strong>OTP Verification:</strong> Required before completing registration or resetting passwords</li> 
<li><strong>Controls:</strong> Admins/Superadmin can create new users and manage existing accounts</li> 
<li><strong>Profile Management:</strong> Users can update their personal and account details</li> 
<li><strong>Soft Deletion:</strong> Toggle user activation status without permanently deleting data</li> 
<li><strong>User Directory:</strong> View all users with pagination, sorting, and filtering options</li> 
<li><strong>Profile Picture Upload:</strong> Upload and auto-resize profile images using Multer and Sharp</li> 
</ul>

<h3>📄 API & Documentation - <a href="https://session-auth-express-mongo.onrender.com/api-docs/" target="blank">Swagger</a></h3>
<ul> 
<li><strong>Interactive Documentation:</strong> Explore and test API endpoints directly from the browser</li> 
<li><strong>Auto-Generated Specs:</strong> OpenAPI-based docs generated from route definitions</li> 
<li><strong>Authentication Support:</strong> Easily test secured endpoints using auth headers (e.g., sessions or tokens)</li> 
<li><strong>Schema Validation:</strong> Ensures request and response formats match the defined API contract</li> 
</ul>

<h3>🔎 Logging & Monitoring – <a href="https://session-auth-express-mongo.onrender.com/logs/" target="blank">Winston</astrong></h3>
<ul> 
<li><strong>Structured Logging:</strong> Logs are categorized by severity levels (info, warn, error) for better traceability</li> 
<li><strong>Log Filtering:</strong> Easily view logs based on severity and date to aid in debugging and analysis</li> 
<li><strong>Audit-Ready Exports:</strong> Download logs in <code>.csv</code> format for compliance, reporting, or audit purposes</li> 
</ul>
 
<h3>📘 Architecture: MVC Pattern</h3>
<p>The application follows the <strong>Model-View-Controller (MVC)</strong> architectural pattern to promote separation of concerns, improve maintainability, and support scalable development.</p> 
<ul> 
<li><strong>Model:</strong> Defines data structures and business rules using Mongoose schemas (e.g., <code>User</code>, <code>OTP</code>)</li> 
<li><strong>View:</strong> Server-rendered UI using EJS templates for displaying data and forms to the user</li> 
<li><strong>Controller:</strong> Handles application logic, processes incoming requests, manages authentication, and coordinates between Models and Views</li> 
</ul>


<h3>🧠 Performance Optimization – Redis Cloud Integration</h3>
<p> To enhance application performance and reduce database load, <strong>Redis Cloud</strong> has been integrated using the <code>ioredis</code> client. This enables fast, in-memory caching for frequently accessed routes data. </p> 
<ul> 
<li><strong>Dynamic Caching:</strong> Responses are cached using unique keys based on query parameters (e.g., pagination, sorting, filtering) to ensure accurate results for different requests.</li> 
<li><strong>Automatic TTL:</strong>  Cached data automatically expires based on the <code>CACHE_TTL</code> environment variable, keeping the cache fresh and relevant.</li> 
<li><strong>Manual Invalidation:</strong>  Cache entries are cleared when user data is updated/deleted/activated/deactivated to  maintain consistency.</li> 
<li><strong>Setup:</strong> Define <code>REDIS_HOST</code>, <code>REDIS_PORT</code>, and <code>REDIS_PASSWORD</code> in your environment config.</li> 
</ul> 
<p>⚠️ Using Redis Cloud Free Tier (trial account) – may have connection/resource limits.</p>
 
<h3>✅ Testing (Coming Soon)</h3>
<p>
Testing is in progress and will use Node's built-in <code>node:test</code> module for unit and integration testing without external libraries.
</p>
<!--
<h3>✅ Testing – Built-in node:test Module</h3>
<p> This project uses the built-in <code>node:test</code> module (available from Node.js v18+) to implement and run unit and integration tests without requiring external libraries like Mocha or Jest. This approach simplifies setup and reduces dependencies while maintaining test reliability. </p>
<ul> 
<li><strong>Minimal Setup:</strong> No third-party testing frameworks needed.</li> 
<li><strong>Structured Testing:</strong> Supports test suites, subtests, assertions, and timeouts.</li> 
<li><strong>Built-in Assertions:</strong> Uses <code>assert</code> module for validation.</li> 
<li><strong>Watch Mode (Optional):</strong> Run tests automatically on file changes with <code>--watch</code>.</li> 
</ul>
-->
 
<h2>🧰 Tech Stack</h2>

<h3>⚙️ Deployment Tools</h3>
<ul>
<li><strong>GitHub</strong> – Source code management, version control, and collaboration</li> 
<li><strong>Render.com</strong> – Cloud hosting platform for deploying and scaling Express.js applications</li> 
<li><strong>MongoDB Atlas</strong> – Fully managed, cloud-based NoSQL database with built-in scalability and high availability</li> 
<li><strong>Redis Cloud</strong> – In-memory caching (via <code>ioredis</code>) to optimize performance for frequently accessed routes</li>
</ul>

<h3>📦 Backend Technologies</h3>
<ul> 
<li><strong>Express.js</strong> – Minimal and flexible Node.js web application framework for building APIs and server-side logic</li> 
<li><strong>MongoDB Atlas</strong> – Cloud-hosted, highly scalable NoSQL database with built-in monitoring and security features</li> 
<li><strong>Mongoose</strong> – Elegant MongoDB object modeling (ODM) library for defining schemas and managing data relationships</li> 
<li><strong>EJS</strong> – Lightweight templating engine for rendering dynamic server-side HTML views</li> 
<li><strong>caching</strong> – Robust <code>ioredis</code> client for implementing in-memory caching and improving response performance</li> 
</ul>

<h3>🔐 Security </h3>
<ul> 
<li><strong>Bcrypt</strong> – Secure password hashing with salting to protect user credentials</li> 
<li><strong>express-session</strong> – Manages user sessions on the server side</li> 
<li><strong>connect-mongo</strong> – Persists session data in MongoDB for scalability and reliability</li> 
<li><strong>express-rate-limit</strong> – Limits repeated requests to APIs, mitigating brute-force and denial-of-service attacks</li> 
<li><strong>Helmet</strong> – Sets various HTTP headers to safeguard against common web vulnerabilities (XSS, clickjacking, etc.)</li> 
<li><strong>CORS</strong> – Enables secure, cross-origin resource sharing with fine-grained control</li> 
</ul>

<h3>📑 Validation</h3>
<ul>
<li><strong>Zod</strong> – Type-safe schema validation for incoming data</li>
<li><strong>deep-email-validator</strong> – Deep email validation for real addresses</li>
</ul>

<h3>📧 Email & OTP</h3>
<ul>
<li><strong>Nodemailer</strong> – SMTP-based email sending (e.g., for OTPs)
<li><strong>Twilio</strong> –  SMS Notification on success registation/password changed/forget password. (trial account - self only)</h3>
</ul>

<h3>📁 File Upload & Image Processing</h3>
<ul>
<li><strong>Multer</strong> – Handles file uploads (e.g., profile pictures)</li>
<li><strong>Sharp</strong> – Image resizing, compression, format conversion</li>
</ul>

<h3>📦 Performance</h3>
<ul>
<li><strong>compression</strong> – Enables Gzip/Brotli compression for faster load times</li>
</ul>

<h3>🛡️ Future-Proofing</h3>
<p>This application is built with extensibility in mind, allowing for easy integration of additional features and technologies as the project evolves.</p>
<ul>
<li><strong>Cloud Storage for Images:</strong> Integration with services like Cloudinary, Firebase Storage, or AWS S3 for scalable image hosting</li> 
<li><strong>Multi-Factor Authentication (MFA):</strong> Additional layer of login security via email, SMS, or authenticator apps</li> 
<li><strong>Custom Email Templates:</strong> Use of MJML or SendGrid for responsive and branded transactional emails</li> 
<li><strong>Automated Testing:</strong> Integration with testing frameworks like <code>Jest</code> or <code>Mocha/Chai</code> for unit and integration testing</li>
</ul>