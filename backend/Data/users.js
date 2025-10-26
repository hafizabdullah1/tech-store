import bcrypt from 'bcryptjs';
const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Ali Ahmad',
        email: 'ali@example.com',
        password: bcrypt.hashSync('123456', 10),

    },
    {
        name: 'Hafiz Abdullah',
        email: 'hafiz@example.com',
        password: bcrypt.hashSync('123456', 10)
    }
]
export default users;