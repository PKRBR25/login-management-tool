# Login Management Tool - Specifications

## Project Overview
The Login Web App is designed to manage the users that will have acess to the dashboard. Users can Sign Up, Login and Recover Password. It is built using Next.js 15, Node.js 20, Tailwind CSS, Lucid Icons and modern and responsive UI.
For framework: Next.js
Authentication: NextAuth.js
Database: PostgreSQL
Email Provider: GOOGLE SMTP

## Functionalities
01.Sign Up 
Components:
	Pages: Login Page; User Registration Page; 
	Flows: Sign Up Flow

02.Login
Components:
	Pages: Login Page; 
	Flows: Login Flow

03.Forgot Password   
Components:
	Pages: Login Page; Reset Password Page; Reset Password Email Confirmation Page;
	Flows: Forgot Password Flow

## Flows
01. Sign Up Flow: 
##Flow Description:
	Entry Point: Login Page
			Screen: Login Page
			User Action: Click the Sign Up Link (Text: "Don’t have an account? Sign up")
			System Action: Redirect to User Registration Page
		     User Registration Page
			Screen: User Registration Page
			User Action: Fill the inputs Click the Sign Up Link (Text: "Don’t have an account? Sign up")
			System Action: Run the Decision Point action to proceed with the correct outcome
		     Decision Point: Valid Information
			Screen: User Registration Page
			System Action_01: If the user fill all the required fields with valid information the system send the email for "Email Validation Template - V0" and insert the data in the "users" table of the database
			System Action_02: If the user does not fill all the required fields with valid information the system should follow the rules and validations described in "User Registration Page" and do not allow the user to continue until all the required fields have valid information
		     User Registration Token Confirmation Page
			Screen: User Registration Token Confirmation Page
			User Action: Fill the inputs Click the Submit button 
			System Action: Run the Decision Point action to proceed with the correct outcome
		     Decision Point: Valid Information
			Screen: User Registration Token Confirmation Page
			System Action_01: If the user fill all the required fields with valid information the system will Log In redirecting the user to the Dashboard Page and insert the data ("is_verified"/"verified_since") in the "users" table of the database
			System Action_02: If the user does not fill all the required fields with valid information the system should follow the rules and validations described in "User Registration Token Confirmation Page" and do not allow the user to continue until all the required fields have valid information
02. Login Flow:
##Flow Description:
	Entry Point: Login Page
			Screen: Login Page
			User Action: Fill the inputs Click Login button
			System Action: Run the Decision Point action to proceed with the correct outcome
 	        Decision Point: Valid Information
			Screen: Login Page
			System Action_01: If the user fill all the required fields with valid information the system should start a session and redirect he user to the Dashboard page
			System Action_02: If the user does not fill all the required fields with valid information the system should follow the rules and validations described in "Login Page" and do not allow the user to continue until all the required fields have valid information
03. Forgot Password Flow:
##Flow Description:
	Entry Point: Login Page
			Screen: Login Page
			User Action: Click the Forgot Password Link (Text: "Forgot Password")
			System Action: Redirect to Reset Password Email Confirmation Page
		     Reset Password Email Confirmation Page
			Screen: Reset Password Email Confirmation Page
			User Action: Fill the inputs Click the Send Code button
			System Action: Run the Decision Point action to proceed with the correct outcome
		     Decision Point: Valid Information
			Screen: Reset Password Email Confirmation Page
			System Action_01: If the user fill all the required fields with valid information the system send the email for "Email for Password Reset Template - V0" and insert the data in the "password_reset" table of the database
			System Action_02: If the user does not fill all the required fields with valid information the system should follow the rules and validations described in "Reset Password Email Configuration Page" and do not allow the user to continue until all the required fields have valid information
		     Reset Password Page
			Screen: Reset Password Page
			User Action: Fill the inputs Click the Submit button 
			System Action: Run the Decision Point action to proceed with the correct outcome
		     Decision Point: Valid Information
			Screen: Reset Password Page
			System Action_01: If the user fill all the required fields with valid information the system will redirect the user to the Login Page and insert the data ("hashed_password") in the "users" table of the database
			System Action_02: If the user does not fill all the required fields with valid information the system should follow the rules and validations described in "Reset Password Page" and do not allow the user to continue until all the required fields have valid information


## Pages
01.Login Page: welcome message "Welcome to your standard Login Page"
	 - Fields
		 - Email input (required, must follow valid format)
		 - Password input (required, secure format, at least 12 characters, at least one uppercase letter,at least one lowercase letter, at least one number, at least one special character)
		 - "Forgot Password?" link
		 - "Sign Up" link
		 - Login button
	 - Form validation
	 - Validation and Errors
	 - Real-time validation on blur and input change
 	 - Show “Incorrect Password” if applicable
	 - Show “Plase enter a valid email” if applicable

02.User Registration Page: welcome message "Insert your informations to register"
		 - Fields
	 		- Email input (required, must follow valid format)
	 		- Password input (required, secure format with at least 12 caracters)
	 		- Confirm Password input (must match password)
	 		- Submit Button
			- "back" button (send back to Login Page)
	 	- Validation and Errors
	 	- Real-time validation on blur and input change
	 	- Show “Passwords do not match” while Password input and Confirm Password input does not match
	 	- Sends data to backend API

03.User Registration Token Confirmation Page: welcome message "Welcome confirm you information to validate your user"
		 - Fields
	 		- Email input (required, must follow valid format)
	 		- Verification Token input (required, must match the "verification_token" in "users" table of the database)
	 		- Password input (required, must match the "hashed_password" in "users" table of the database aplying the encryption)
	 		- Submit Button
			- "back" button (send back to Login Page)
	 	- Validation and Errors
	 	- Real-time validation on blur and input change
	 	- Show “Passwords do not match” while Password input and Confirm Password input does not match
	 	- Sends data to backend API
	
04.Dashboard Page: welcome message "Welcome to your session"
		 - Fields
	 		- User Email (show)
	 		- User Full Name (show) 
			- User active_since (show)
			- "Logout" button (Log out the sesion and redirect to Login Page)
	
05.Reset Password Page: welcome message "Reset your Password"
	 - Fields
		 - Email input (required, must follow valid format)
		 - New Password input (required, secure format, at least 12 characters, at least one uppercase letter,at least one lowercase letter, at least one number, at least one special character)
 		 - Confirm New Password input (must match password)
		 - Validation Code input (must be the 6 digit code associated in the database to the request made by the user and the same code send by email)
 		 - Submit button (only allow activation in the passwords match and the email is associated to the Code in the database)
	 - Form validation
	 - Validation and Errors
	 - Real-time validation on blur and input change
 	 - Show “Incorrect Password” if applicable
	 - Show “Plase enter a valid email” if applicable

06.Reset Password Email Confirmation Page: welcome message "Confirm your request to reset your password"
	 - Fields
		 - Email input (required, must follow valid format)
 		 - "Send Code" button (only if the email is in the database, this code should be saved in a new table of the database associated to the time and date and email of the user request to be further validated)
 		 - "back" button (send back to Login Page)
	   	 - Validate if the email is in the database
	 	 - Show “Email not registered” if applicable
 	 - Form validation
	 - Validation and Errors
	 - Real-time validation on blur and input change
 	 - Show “Plase enter a valid email” if applicable


## Database

##Set up PostgreSQL database
##Create the following tables in the database:
	1. users: This will be the main table and should have all the data needed to manage the users of the web app. The field "users_id" should appears in the tables password_reset to correlate the data from a specific user to the data in the other table. 

		**Column Name; Data Type; Nullable; Default; Description;
		 users_id; INTEGER; NOT NULL; SERIAL; Primary key, auto-incrementing integer; 
		 email; VARCHAR; NOT NULL; -; User's email address (must be unique);
		 hashed_password; VARCHAR; NOT NULL; -; Securely hashed password using bcrypt;
		 full_name; VARCHAR; NULL; NULL; User's full name (optional);
		 created_at; TIMESTAMP WITH TIME ZONE; NOT NULL; CURRENT_TIMESTAMP; When the user was created;
		 updated_at; TIMESTAMP WITH TIME ZONE; NOT NULL; CURRENT_TIMESTAMP; When the user had the last modification in "is_active" status;
		 is_active; BOOLEAN; NOT NULL; TRUE; Flag to indicate if the account is active;
		 active_since; TIMESTAMP WITH TIME ZONE; NOT NULL; CURRENT_TIMESTAMP; When the user was created, when the status "is_active" change, update this field;
		 verification_token; INTEGER; NULL; NULL; 6-digit code (100000-999999) for email verification (unique);
		 is_verified; BOOLEAN; NOT NULL; FALSE; Flag to indicate if email is verified;
		 verified_since: TIMESTAMP WITH TIME ZONE; NOT NULL; CURRENT_TIMESTAMP; When the user was verified;
	
	2. password_reset: This will be the table to control the attempts of a user to recover their password and the time that the user has to change the password before the code generated expires. 

		**Column Name; Data Type; Nullable; Default; Description;
		 pr_id; INTEGER; NOT NULL; SERIAL; Primary key, auto-incrementing integer;
		 users_id; INTEGER; NOT NULL; SERIAL; Primary key, from "users" table for the specific user;
		 pr_token; INTEGER; NULL; NULL; 6-digit code (100000-999999) for password recovery verification (unique);
		 pr_token_expires_at; TIMESTAMP WITH TIME ZONE; NULL; NULL; When the "pr_token" expires;
		 pr_token_locked_until; TIMESTAMP WITH TIME ZONE; NULL; NULL; Account locked for verification using this specific "pr_token" until this time;
		 pr_token_valid_until; TIMESTAMP WITH TIME ZONE; NULL; NULL; Account locked for verification using this specific "pr_token" after this time;
		 
##Additional Notes:
	1. Indexes:
	Primary key index on "users_id"
	Unique index on email
	Unique index on verification_token
	Unique index on pr_token
	2. Default Values:
	is_active defaults to TRUE (new users are active by default)
	is_verified defaults to FALSE (email must be verified)
	created_at and updated_at are automatically managed by the database
	3. Security:
	Passwords are never stored in plain text - they are hashed using bcrypt
	"verification_token" and "pr_token" tokens are randomly generated 6 digit code (100000-999999)
	4. Relationships:
	Currently, there are no foreign key relationships in this schema


##  Email Templates

##For Email Templates we will use Configuration Files, so please make sure to store templates in files (e.g., JSON, YAML) with version control.
##Create the following Templates in files:
	
	1. Email for Email Validation Template - V0:
		<!DOCTYPE html>
		<html lang="en">
		<head>
		    <meta charset="UTF-8">
		    <meta name="viewport" content="width=device-width, initial-scale=1.0">
		    <title>Verify Your Email Address</title>
		    <style>
		        body {
		            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		            line-height: 1.6;
		            color: #333333;
		            max-width: 600px;
		            margin: 0 auto;
		            padding: 20px;
		        }
		        .header {
		            text-align: center;
		            padding: 20px 0;
		            border-bottom: 1px solid #eaeaea;
		            margin-bottom: 30px;
		        }
		        .logo {
		            max-width: 180px;
		            height: auto;
		        }
		        .content {
		            padding: 0 20px;
		        }
		        .button {
		            display: inline-block;
		            padding: 12px 30px;
		            background-color: #4F46E5;
		            color: white !important;
		            text-decoration: none;
		            border-radius: 6px;
		            font-weight: 600;
		            margin: 25px 0;
		        }
		        .footer {
		            margin-top: 40px;
		            padding-top: 20px;
		            border-top: 1px solid #eaeaea;
		            font-size: 12px;
		            color: #666666;
		            text-align: center;
		        }
		        .code {
		            font-family: monospace;
		            font-size: 24px;
		            letter-spacing: 2px;
		            background-color: #f5f5f5;
		            padding: 10px 20px;
		            border-radius: 4px;
		            margin: 20px 0;
		            display: inline-block;
		        }
		        .expiry-note {
		            color: #666666;
		            font-size: 14px;
		            font-style: italic;
		        }
		    </style>
		</head>
		<body>
		    <div class="header">
		        <img src="https://yourdomain.com/logo.png" alt="Company Logo" class="logo">
		    </div>
		    
		    <div class="content">
		        <h2>Verify Your Email Address</h2>
		        
		        <p>Hello <strong>{{user_full_name}}</strong>,</p>
		        
		        <p>Thank you for signing up with {{company_name}}! To complete your registration, please verify your email address by entering the following verification code:</p>
		        
		        <div class="code">{{verification_code}}</div>
		        
		        <p class="expiry-note">This code will expire in 15 minutes.</p>
		        
		        <p>If you didn't create an account with us, you can safely ignore this email.</p>
		        
		        <p>For security reasons, please don't share this code with anyone. Our support team will never ask you for this code.</p>
		        
		        <p>Need help? Contact our support team at <a href="mailto:support@yourdomain.com">support@yourdomain.com</a></p>
		        
		        <p>Welcome aboard!<br>The {{company_name}} Team</p>
		    </div>
		    
		    <div class="footer">
		        <p>© {{current_year}} {{company_name}}. All rights reserved.</p>
		        <p>
		            <a href="{{privacy_policy_url}}" style="color: #4F46E5; text-decoration: none;">Privacy Policy</a> | 
		            <a href="{{terms_url}}" style="color: #4F46E5; text-decoration: none;">Terms of Service</a>
		        </p>
		        <p>
		            {{company_address_line1}}<br>
		            {{company_address_line2}}
		        </p>
		        <p>
		            <a href="{{unsubscribe_url}}" style="color: #666666; text-decoration: underline;">Unsubscribe</a> | 
		            <a href="{{preferences_url}}" style="color: #666666; text-decoration: underline;">Email Preferences</a>
		        </p>
		    </div>
		</body>
		</html>

	2. Email for Password Reset Template - V0:
		<!DOCTYPE html>
		<html lang="en">
		<head>
		    <meta charset="UTF-8">
		    <meta name="viewport" content="width=device-width, initial-scale=1.0">
		    <title>Password Reset Request</title>
		    <style>
		        body {
		            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		            line-height: 1.6;
		            color: #333333;
		            max-width: 600px;
		            margin: 0 auto;
		            padding: 20px;
		        }
		        .header {
		            text-align: center;
		            padding: 20px 0;
		            border-bottom: 1px solid #eaeaea;
		            margin-bottom: 30px;
		        }
		        .logo {
		            max-width: 180px;
		            height: auto;
		        }
		        .content {
		            padding: 0 20px;
		        }
		        .button {
		            display: inline-block;
		            padding: 12px 30px;
		            background-color: #4F46E5;
		            color: white !important;
		            text-decoration: none;
		            border-radius: 6px;
		            font-weight: 600;
		            margin: 25px 0;
		        }
		        .footer {
		            margin-top: 40px;
		            padding-top: 20px;
		            border-top: 1px solid #eaeaea;
		            font-size: 12px;
		            color: #666666;
		            text-align: center;
		        }
		        .code {
		            font-family: monospace;
		            font-size: 24px;
		            letter-spacing: 2px;
		            background-color: #f5f5f5;
		            padding: 10px 20px;
		            border-radius: 4px;
		            margin: 20px 0;
		            display: inline-block;
		        }
		        .expiry-note {
		            color: #666666;
		            font-size: 14px;
		            font-style: italic;
		        }
		    </style>
		</head>
		<body>
		    <div class="header">
		        <img src="https://yourdomain.com/logo.png" alt="Company Logo" class="logo">
		    </div>
		    
		    <div class="content">
		        <h2>Reset Your Password</h2>
		        
		        <p>Hello <strong>{{user_full_name}}</strong>,</p>
		        
		        <p>We received a request to reset the password for your account. Use the following verification code to proceed:</p>
		        
		        <div class="code">{{verification_code}}</div>
		        
		        <p class="expiry-note">This code will expire in 15 minutes.</p>
		        
		        <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
		        
		        <p>For security reasons, please don't share this code with anyone. Our support team will never ask you for this code.</p>
		        
		        <p>Need help? Contact our support team at <a href="mailto:support@yourdomain.com">support@yourdomain.com</a></p>
		        
		        <p>Best regards,<br>The {{company_name}} Team</p>
		    </div>
		    
		    <div class="footer">
		        <p>© {{current_year}} {{company_name}}. All rights reserved.</p>
		        <p>
		            <a href="{{privacy_policy_url}}" style="color: #4F46E5; text-decoration: none;">Privacy Policy</a> | 
		            <a href="{{terms_url}}" style="color: #4F46E5; text-decoration: none;">Terms of Service</a>
		        </p>
		        <p>
		            {{company_address_line1}}<br>
		            {{company_address_line2}}
		        </p>
		        <p>
		            <a href="{{unsubscribe_url}}" style="color: #666666; text-decoration: underline;">Unsubscribe</a> | 
		            <a href="{{preferences_url}}" style="color: #666666; text-decoration: underline;">Email Preferences</a>
		        </p>
		    </div>
		</body>
		</html>


## Notes
- All forms should implement proper validation
- Error messages should be user-friendly
- Implement rate limiting for authentication endpoints
- All sensitive data must be encrypted in transit and at rest

## Future Enhancements
- Two-factor authentication
- Social login integration
- Account recovery options
- Activity logging
