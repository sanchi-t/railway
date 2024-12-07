# Railway Management API


## API Endpoints

### Auth Routes

#### POST /auth/register
- **Description**: Register the user.
- **Request Body**:
  ```
    {
        "username": "xzy",
        "password": "123",
        "role": "admin" //optional
    }
  ```

#### POST /auth/login
- **Description**: Logs in the user.
- **Request Body**:
   ```
   {
        "username": "xzy",
        "password": "123",
    }
   ```

### User Routes

#### GET /user/availability
- **Description**: Fetch a list of trains between source and destination.
- **Params**: 
   ```
    {
        "source": "delhi",
        "destination": "mumbai"
    }
   ```
- **Headers**:
    ```
    {
        "Authorization": "token"
    }
    ```

#### GET /user/availability/:trainId
- **Description**: Fetch the details of the train with that trainId.
- **Headers**:
   ```
    {
        "Authorization": "token"
    }
   ```

#### POST /user/book
- **Description**: Books the number of seats in the train.
- **Request Body**: 
    ```
    {
        "trainId": "13",
        "seats": "2"
    }
    ```
- **Headers**:
   ```
    {
        "Authorization": "token"
    }
   ```

#### GET /user/bookings
- **Description**: Fetch a list of bookings of the user.
- **Headers**:
   ```
    {
        "Authorization": "token"
    }
   ```

#### GET /user/bookings/:bookingId
- **Description**: Fetches the details of the booking with that bookingId.
- **Headers**:
   ```
    {
        "Authorization": "token"
    }
   ```

### Admin Routes

#### POST /admin/trains
- **Description**: Adds a train in the db.
- **Request Body**:
   ```
    {
        "trainNumber": 8,
        "source": "Jammu",
        "destination": "Gujrat",
        "totalSeats": 100,
        "availableSeats": 0
    }
   ```
- **Headers**:
    ```
    {
        "Authorization": "token",
        "x-admin-api-key": "api-key"
    }
    ```

#### PUT /admin/trains/:trainId/seats
- **Description**: Updates the seats in a train.
- **Request Body**:
   ```
    {
        "totalSeats": 40,
        "availableSeats": 400
    }
   ```
- **Headers**:
    ```
    {
        "Authorization": "token",
        "x-admin-api-key": "api-key"
    }
    ```

## Setup Instructions

1. **Clone the repository**  
   Clone the project to your local machine:  
   `git clone https://github.com/sanchi-t/railway`

2. **Install dependencies**  
   Navigate to the project directory and install the necessary dependencies:  
   `npm install`

3. **Setup the database**  
   Set up your PostgreSQL database and create the database.

4. **Configure environment variables**  
   Create a `.env` file in the root directory and configure the like the .env-sample.

5. **Start the server**  
   Run the application using:  
   "node src/server.js"

6. **Access the API**  
   The API will be accessible at `http://localhost:3000`.

---

