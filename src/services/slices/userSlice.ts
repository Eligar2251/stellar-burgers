import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  getUserApi
} from '@api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginRequest: boolean;
  registerRequest: boolean;
  updateUserRequest: boolean;
  logoutRequest: boolean;
  error: string | null;
  updateUserError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loginRequest: false,
  registerRequest: false,
  updateUserRequest: false,
  logoutRequest: false,
  error: null,
  updateUserError: null
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (
    data: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      return await registerUserApi(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка регистрации'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await loginUserApi(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка авторизации'
      );
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Не удалось получить пользователя'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    data: { name: string; email: string; password?: string },
    { rejectWithValue }
  ) => {
    try {
      return await updateUserApi(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось обновить профиль'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось выйти из аккаунта'
      );
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: { payload: boolean }) => {
      state.isAuthChecked = action.payload;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserError: (state) => state.error,
    selectUpdateUserError: (state) => state.updateUserError,
    selectLoginRequest: (state) => state.loginRequest,
    selectRegisterRequest: (state) => state.registerRequest,
    selectUpdateUserRequest: (state) => state.updateUserRequest,
    selectLogoutRequest: (state) => state.logoutRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerRequest = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerRequest = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        saveTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerRequest = false;
        state.error = action.payload as string;
        state.isAuthChecked = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.loginRequest = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginRequest = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        saveTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginRequest = false;
        state.error = action.payload as string;
        state.isAuthChecked = true;
      })

      .addCase(fetchUser.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.updateUserRequest = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateUserRequest = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserRequest = false;
        state.updateUserError = action.payload as string;
      })

      .addCase(logoutUser.pending, (state) => {
        state.logoutRequest = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutRequest = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        clearTokens();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutRequest = false;
        state.error = action.payload as string;
      });
  }
});

export const checkUserAuth = () => (dispatch: (action: unknown) => void) => {
  if (getCookie('accessToken')) {
    dispatch(fetchUser());
  } else {
    dispatch(setAuthChecked(true));
  }
};

export const { setAuthChecked } = userSlice.actions;

export const {
  selectUser,
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectUserError,
  selectUpdateUserError,
  selectLoginRequest,
  selectRegisterRequest,
  selectUpdateUserRequest,
  selectLogoutRequest
} = userSlice.selectors;

export default userSlice.reducer;
