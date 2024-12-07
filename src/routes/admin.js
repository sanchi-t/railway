const express = require('express');
const { Train } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { adminAuth } = require('../middleware/admin');
const { handleResponse } = require('../utils/responseHandler');

const router = express.Router();

router.post('/trains', authenticateToken, adminAuth, async (req, res) => {
    try {
        const { source, destination, totalSeats, availableSeats, ...otherDetails } = req.body;

        if (!totalSeats || totalSeats <= 0) {
            handleResponse(res, 400, 'Total seats must be greater than zero');
        }

        if (availableSeats !== undefined && (availableSeats < 0 || availableSeats > totalSeats)) {
            return handleResponse(res, 400, 'Available seats must be greater than or equal to zero and less than or equal to total seats.');
        }

        const train = await Train.create({
            source: source.toLowerCase(),
            destination: destination.toLowerCase(),
            totalSeats,
            availableSeats: availableSeats !== undefined ? availableSeats : totalSeats,
            ...otherDetails,
        });

        return handleResponse(res, 200, 'Train added successfully', train);
    } catch (err) {
        return handleResponse(res, 500, 'Error adding train seats.', err.message);
    }
});


router.put('/trains/:id/seats', authenticateToken, adminAuth, async (req, res) => {
    const trainId = req.params.id;
    const { totalSeats, availableSeats } = req.body; 

    try {
        if (!totalSeats || totalSeats < 0) {
            return handleResponse(res, 400, 'Invalid total seats value provided.');
        }


         if (availableSeats !== undefined && (availableSeats < 0 || availableSeats > totalSeats)) {
            return handleResponse(res, 400, 'Available seats must be greater than or equal to zero and less than or equal to total seats.');
        }


        const train = await Train.findByPk(trainId);

        if (!train) {
            return handleResponse(res, 404, 'Train not found.');
        }

        const updatedTrain = await train.update({
            totalSeats,
            availableSeats,
        });

        return handleResponse(res, 200, 'Train seats updated successfully.', updatedTrain);
    } catch (err) {
        return handleResponse(res, 500, 'Error updating train seats.', err.message);
    }
});

module.exports = router;

