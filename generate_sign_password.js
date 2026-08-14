import bcrypt from "bcrypt"

const password = "123456"

const hash = await bcrypt.hash(password, 12)
console.log("Senha:", password)
console.log("Hash:", hash)