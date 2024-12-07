const express = require('express');
const { Train, Booking } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { handleResponse } = require('../utils/responseHandler');
const sequelize = require('../config/database');

const router = express.Router();

router.get('/availability', authenticateToken, async (req, res) => {
    let { source, destination } = req.query;

    source = source.toLowerCase();
    destination = destination.toLowerCase();

    try {
        const trains = await Train.findAll({
            where: {
                source,
                destination,
            },
        });

        if (trains.length === 0) {
            return handleResponse(res, 404, 'No trains found for the given route');
        }

        return handleResponse(res, 200, 'Trains fetched successfully', trains);
    } catch (err) {
        return handleResponse(res, 500, 'Error fetching train availability', err.message);
    }
});

router.get('/availability/:trainId', authenticateToken, async (req, res) => {
    const { trainId } = req.params;

    try {
        const train = await Train.findByPk(trainId, {
            include: [{
                model: Booking,
                attributes: ['seatsBooked'],
                group: ['trainId'],
            }],
        });

        if (!train) {
            return handleResponse(res, 404, 'Train not found');
        }

        const availableSeats = train.availableSeats;

        return handleResponse(res, 200, 'Seat availability fetched successfully', { 
            trainId: train.id,
            trainNumber: train.trainNumber,
            source: train.source,
            destination: train.destination,
            availableSeats: availableSeats
        });
    } catch (err) {
        return handleResponse(res, 500, 'Error fetching seat availability', err.message);
    }
});

router.post('/book', authenticateToken, async (req, res) => {
    const { trainId, seats } = req.body;
    const userId = req.user.id;

    try {
        const train = await Train.findByPk(trainId);

        if (!train) {
            return handleResponse(res, 404, 'Train not found');
        }

        if (train.availableSeats < seats) {
            return handleResponse(res, 400, 'Not enough seats available');
        }

        const result = await sequelize.transaction(async (t) => {
            const booking = await Booking.create(
                { userId, trainId, seatsBooked: seats },
                { transaction: t }
            );

            train.availableSeats -= seats;
            await train.save({ transaction: t });

            return booking;
        });

        return handleResponse(res, 201, 'Booking successful', result);
    } catch (err) {
        return handleResponse(res, 500, 'Error processing booking', err.message);
    }
});

router.get('/bookings', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const bookings = await Booking.findAll({
            where: { userId },
            include: [{ model: Train, attributes: ['trainNumber', 'source', 'destination'] }],
        });

        if (bookings.length === 0) {
            return handleResponse(res, 404, 'No bookings found for the user');
        }

        return handleResponse(res, 200, 'Booking details fetched successfully', bookings);
    } catch (err) {
        return handleResponse(res, 500, 'Error fetching booking details', err.message);
    }
});

router.get('/bookings/:bookingId', authenticateToken, async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user.id;

    try {
        const booking = await Booking.findOne({
            where: {
                id: bookingId,
                userId: userId,
            },
            include: [{ model: Train, attributes: ['trainNumber', 'source', 'destination'] }],
        });

        if (!booking) {
            return handleResponse(res, 404, 'Booking not found');
        }

        return handleResponse(res, 200, 'Booking details fetched successfully', booking);
    } catch (err) {
        return handleResponse(res, 500, 'Error fetching booking details', err.message);
    }
});


module.exports = router;

