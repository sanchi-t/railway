const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Train = require('./Train');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    seatsBooked: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

Booking.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Booking.belongsTo(Train, { foreignKey: 'trainId', onDelete: 'CASCADE' });

module.exports = Booking;

