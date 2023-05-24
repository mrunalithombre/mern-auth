const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


exports.register = async (req, res) => {
	try {
		const { password, email } = req.body
		const found = await User.findOne({ email })
		if (found) {
			return res.json({
				message: "Email Already Exists"
			})
		}
		const token = jwt.sign({ name: "kate" }, "SECRET_PASSWORD")

		const hashPass = await bcrypt.hash(password, 10)
		const result = await User.create({
			...req.body,
			password: hashPass
		})
		res.json({
			message: "User Register Success",
			result,
		})
	} catch (error) {
		res.json({ message: "Something Went Wrong", error })
	}
}

exports.fetchUsers = async (req, res) => {
	try {
		const token = req.headers.authorization
		if (!token) {
			return res.json({ message: "Provide Token" })
		}

		jwt.verify(token, process.env.JWT_KEY)

		const result = await User.find()
		res.json({
			message: "User fetch Success",
			result
		})
	} catch (error) {
		res.json({ message: "Something Went Wrong", error })
	}
}

exports.login = async (req, res) => {
	try {
		//email exist
		const { email, password } = req.body
		const result = await User.findOne({ email })

		if (!result) {
			return res.json({ message: "Email is not registered with us" })
		}
		const match = await bcrypt.compare(password, result.password)
		if (!match) {
			return res.json({ message: "password do not match" })
		}
		const token = jwt.json({ name: "kate" }, process.env.JWT_KEY)
		res.json({ message: "login success", token })

	} catch (error) {
		res.json({ message: "Something Went Wrong" + error })
	}
}

exports.destroy = async (req, res) => {
	try {
		await User.deleteMany()
		res.json({ message: "User Destroy Success" })

	} catch (error) {
		res.json({ message: "Something Went Wrong" + error })
	}
}

