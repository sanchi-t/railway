const handleResponse = (res, statusCode, message, data = null) => {
    const response = { message };
    if (data) response.data = data;
    return res.status(statusCode).json(response);
};

module.exports = { handleResponse };

