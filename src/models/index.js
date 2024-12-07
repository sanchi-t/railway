const sequelize = require('../config/database');

const User = require('./User');
const Train = require('./Train');
const Booking = require('./Booking');

User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Train.hasMany(Booking, { foreignKey: 'trainId' });
Booking.belongsTo(Train, { foreignKey: 'trainId' });

const initModels = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('All models synchronized successfully.');
    } catch (error) {
        console.error('Error during model synchronization:', error);
    }
};

module.exports = { sequelize, User, Train, Booking, initModels };

