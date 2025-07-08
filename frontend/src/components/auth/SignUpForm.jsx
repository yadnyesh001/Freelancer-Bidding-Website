import { useState } from "react"
import { useMutation } from '@tanstack/react-query'
import axios from "axios"
import { Link } from "react-router-dom"

const SignUpForm = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("client")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await axios.post("/api/v1/auth/signup", newUser, {
        withCredentials: true,
      })
      return response.data
    },
    onSuccess: (data) => {
      setSuccess(data.message)
      setError("")
      setName("")
      setEmail("")
      setPassword("")
      setRole("client")
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Something went wrong")
      setSuccess("")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({ name, email, password, role })
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          >
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          {mutation.isPending ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  )
}

export default SignUpForm
