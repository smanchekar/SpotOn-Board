import Password from "./password/password";
import Validation from "./password/validation";
import Search from "./search/search";
//import { TextGroup, TextGroup2 } from './text-group/text-group';
import FormWrapper, { FormWrapperState } from "./form-wrapper/form-wrapper";
import LazyLoader, { LazyLoaderState } from "./lazy-loader/lazy-loader";
import { showLoader } from "./loader/loader";
import { showConfirm } from "./confirm/confirm";
import Datetime from "react-datetime";
import { Drawer, Icon as AntIcon, Dropdown, Menu, Table, Popover } from "antd";
import {
    Input,
    Button,
    ButtonVariants,
    Text,
    TextTypes,
    colors,
    Icon,
    IconButton,
    Card,
    Dropdown as Select,
    Badge,
    BadgeVariants,
    showToast,
    ToastVariants,
    LoadingOverlay,
    Modal,
} from "spoton-lib";

// export enum InputNames {
//     RETAILERID = "retailerId",
//     MERCHANTID = "merchantId",
//     GROUPID = "groupId",
//     RETAILERNAME = "retailerName",
//     RETAILERACTIVE = "retailerActive",
//     RETAILERPROFILENAME = "retailerprofilename",
//     RETAILERPROFILEVALUE = "retailerprofilevalue",
// }
export enum InputNames {
    EMAIL = "email",
    PASSWORD = "password",
    FIRSTNAME = "firstname",
    LASTNAME = "lastname",
    OLD_PASSWORD = "oldPassword",
    NEW_PASSWORD = "newPassword",
    CONFIRM_PASSWORD = "confirmPassword",

    RETAILERID = "retailerId",
    MERCHANTID = "merchantId",
    GROUPID = "groupId",
    RETAILERNAME = "retailerName",
    RETAILERACTIVE = "retailerActive",
    RETAILERPROFILENAME = "retailerprofilename",
    RETAILERPROFILEVALUE = "retailerprofilevalue",
}

export interface FormWrappedProps extends FormWrapperState {
    setFormState: (state: any, callback?: () => void) => void;
    isFormValid: () => boolean;
    getInputWrapper: (name: string) => (Component: React.ReactElement) => any;
}

export interface SuspenseProps extends LazyLoaderState {
    listRef: React.RefObject<HTMLDivElement>;
    handlePagination: Function;
    handleSearch: (value: string) => void;
    setState: (state: any) => void;
}

export interface InputProps {
    name?: string;
    type?: string;
    value?: string;
    onChange?: (e: any) => void;
    onBlur?: (e: any) => void;
    label?: string;
    isValid?: boolean;
    errorMessage?: string;
    required?: boolean;
    clearable?: boolean;
}

export {
    Datetime,
    // custom components
    Password,
    Validation,
    Search,
    FormWrapper,
    showLoader,
    showConfirm,
    LazyLoader,
    //TextGroup,
    //TextGroup2,
    // antd components
    Drawer,
    AntIcon,
    Dropdown,
    Menu,
    Table,
    Popover,
    // spoton components
    Input,
    Button,
    ButtonVariants,
    Text,
    TextTypes,
    colors,
    Icon,
    IconButton,
    Card,
    Select,
    Badge,
    BadgeVariants,
    showToast,
    ToastVariants,
    LoadingOverlay,
    Modal,
};
