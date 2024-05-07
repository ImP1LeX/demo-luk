import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const authThunk = createAsyncThunk('authThunk', async (data, { rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:8080/auth', {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const json = await response.json()

        if (!response.ok) {
            return rejectWithValue(json)
        }
        return json
    } catch (error) {
        console.log(error);
        return rejectWithValue(error)
    }
})

const initialState = {
    loading: false,
    token: localStorage.getItem('token'),
    roleid: localStorage.getItem('roleid'),
    id: localStorage.getItem('id'),
    message: undefined,
    error: undefined
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state, action) => {
            state.id = undefined
            state.token = undefined
            state.roleid = undefined
            state.message = undefined
            state.error = undefined
            state.loading = false

            localStorage.removeItem('id')
            localStorage.removeItem('token')
            localStorage.removeItem('roleid')
        }
    },
    extraReducers: (builder) => {
        builder.addCase(authThunk.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(authThunk.fulfilled, (state, action) => {
            const payload = action.payload

            state.id = payload.id
            state.roleid = payload.roleid
            state.token = payload.token

            localStorage.setItem('id', payload.id)
            localStorage.setItem('roleid', payload.roleid)
            localStorage.setItem('token', payload.token)

            state.error = undefined
            state.message = undefined
            state.loading = false
        })
        builder.addCase(authThunk.rejected, (state, action) => {
            const payload = action.payload

            state.error = payload
            state.message = payload.message
            state.loading = false
        })
    }
})

export const { logout } = authSlice.actions
export default authSlice.reducer