import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const regThunk = createAsyncThunk('regThunk', async (data, { rejectWithValue }) => {
    try {
        const response = await fetch('http://localhost:8080/reg', {
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
    message: undefined,
    error: undefined
}

export const regSlice = createSlice({
    name: 'reg',
    initialState,
    reducers: {
        reset: (state, action) => {
            state.message = undefined
            state.error = undefined
            state.loading = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(regThunk.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(regThunk.fulfilled, (state, action) => {
            const payload = action.payload

            state.message = payload.message
            state.error = undefined
            state.loading = false
        })
        builder.addCase(regThunk.rejected, (state, action) => {
            const payload = action.payload

            state.message = payload.message
            state.error = payload
            state.loading = false
        })
    }
})

export const { reset } = regSlice.actions
export default regSlice.reducer