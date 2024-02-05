interface Errors {
    email?: string;
    password?: string;
    name?: string;
    password_confirm?: string;
    role?: string;
    profession?: string;
    street?: string;
    city?: string;
    country?: string;
    description?: string; 
  }
  
  export default function loginValidate(values: { email: string; password: string }): Errors {
    const errors: Errors = {};
  
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
  
    if (!values.password) {
      errors.password = 'Required';
    } else if (values.password.length < 4 || values.password.length > 20) {
      errors.password = 'Must be greater than 4 and less than 20 characters long';
    } else if (values.password.includes(' ')) {
      errors.password = 'Invalid Password';
    }
  
    return errors;
  }
  
  export function registerValidate(values: {
    email: string;
    password: string;
    name: string;
    password_confirm: string;
    role: 'Merchant' | 'Customer' | undefined;
  }): Errors {
    const errors: Errors = {};
  
    if (!values.name) {
      errors.name = 'Required';
    } else if (values.name.includes(' ')) {
      errors.name = 'Invalid name...!';
    }
  
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
  
    if (!values.password) {
      errors.password = 'Required';
    } else if (values.password.length < 8 || values.password.length > 20) {
      errors.password = 'Must be greater than 8 and less than 20 characters long';
    } else if (values.password.includes(' ')) {
      errors.password = 'Invalid Password';
    }
  
    if (!values.password_confirm) {
      errors.password_confirm = 'Required';
    } else if (values.password !== values.password_confirm) {
      errors.password_confirm = 'Password Not Match...!';
    } else if (values.password_confirm.includes(' ')) {
      errors.password_confirm = 'Invalid Confirm Password';
    }

    if (!values.role) {
        errors.role = 'Required';
      } else if (values.role !== 'Merchant' && values.role !== 'Customer') {
        errors.role = 'Invalid role selected';
      }
  
    return errors;
  }
  
  export function overviewValidate(values: {
    name: string;
    profession: string;
    street: string;
    city: string;
    country: string;
    description: string;
  }): Errors {
    const errors: Errors = {};
  
    if (!values.name) {
      errors.name = 'Required';
    } else if (values.name.includes(' ')) {
      errors.name = 'Invalid name...!';
    }
  
    if (!values.profession) {
      errors.profession = 'Required';
    } else if (values.profession.includes(' ')) {
      errors.profession = 'Invalid profession...!';
    }
  
    if (!values.street) {
      errors.street = 'Required';
    } else if (values.street.includes(' ')) {
      errors.street = 'Invalid street...!';
    }
  
    if (!values.city) {
      errors.city = 'Required';
    } else if (values.city.includes(' ')) {
      errors.city = 'Invalid city...!';
    }
  
    if (!values.country) {
      errors.country = 'Required';
    } else if (values.country.includes(' ')) {
      errors.country = 'Invalid country...!';
    }
  
    if (!values.description) {
      errors.description = 'Required';
    } else if (values.description.includes(' ')) {
      errors.description = 'Invalid description...!';
    }
  
    return errors;
  }

  export function doctorRegisterValidate(values: {
    first_name: string;
    last_name: string;
    government_id_number: string;
    medical_license_number: string;
    specialization: string;
    contact_info: {
      email: {
        email: string;
        // verified: boolean;
      };
      work_number: {
        phone_number: number;
        country_code: number;
        // verified: boolean;
      };
      emergency_number: {
        phone_number: number;
        country_code: number;
        // verified: boolean;
      };
    };
    password: string;
    confirm_password: string;
  }): Record<string, string> {
    const errors: Record<string, any> = {};
  
    // Validate first_name
    if (!values.first_name.trim()) {
      errors.first_name = "First name is required";
    }
  
    // Validate last_name
    if (!values.last_name.trim()) {
      errors.last_name = "Last name is required";
    }
  
    // Validate government_id_number
    if (!values.government_id_number.trim()) {
      errors.government_id_number = "Government ID number is required";
    }
  
    // Validate medical_license_number
    if (!values.medical_license_number.trim()) {
      errors.medical_license_number = "Medical license number is required";
    }
  
    // Validate specialization
    if (!values.specialization.trim()) {
      errors.specialization = "Specialization is required";
    }
  
    // Validate contact_info
    const contactErrors: Record<string, any> = {};
  
    // Validate email
    if (!values.contact_info.email.email.trim()) {
      contactErrors.email = "Email is required";
    }
  
    // Validate work_number
    if (!values.contact_info.work_number.phone_number || !values.contact_info.work_number.country_code) {
      contactErrors.work_number = "Work number is required";
    }

    // Validate emergency_number
    if (!values.contact_info.emergency_number.phone_number || !values.contact_info.emergency_number.country_code) {
      contactErrors.emergency_number = "Emergency number is required";
    }

  
    if (Object.keys(contactErrors).length > 0) {
      errors.contact_info = contactErrors;
    }
  
    // Validate password
    if (!values.password.trim()) {
      errors.password = "Password is required";
    }
  
    // Validate confirm_password
    if (!values.confirm_password.trim()) {
      errors.confirm_password = "Confirm password is required";
    } else if (values.confirm_password !== values.password) {
      errors.confirm_password = "Passwords do not match";
    }
  
    return errors;
  }

  export function pharmacyRegisterValidate(values: {
    pharmacy_name: string;
    address: {
      
      country: string;
      city: string;
      street_address: string;
    };
    contact_information: {
      email: {
        email: string;
        // verified: boolean;
      };
      work_number: {
        phone_number: number;
        country_code: number;
        // verified: boolean;
      };
      emergency_number: {
        phone_number: number;
        country_code: number;
        // verified: boolean;
      };
    };
    password: string;
    confirm_password: string;
  }) {
    const errors: Record<string, any> = {};
  
    // Validate pharmacy_name
    if (!values.pharmacy_name) {
      errors.pharmacy_name = 'Pharmacy name is required';
    }
  
    // Validate address
    if (!values.address) {
      errors.address = 'Address is required';
    } else {
      // Validate coordinates
      
  
      // Validate country
      if (!values.address.country) {
        errors.address = {
          ...errors.address,
          country: 'Country is required',
        };
      }
  
      // Validate city
      if (!values.address.city) {
        errors.address = {
          ...errors.address,
          city: 'City is required',
        };
      }
  
      // Validate street_address
      if (!values.address.street_address) {
        errors.address = {
          ...errors.address,
          street_address: 'Street address is required',
        };
      }
    }
  
    // Validate contact_info
    const contactErrors: Record<string, any> = {};
  
    // Validate contact_information
  
      // Validate email
      if (!values.contact_information.email.email.trim()) {
        contactErrors.email = 'Email is required';
      }
  
      // Validate work_number
      if (!values.contact_information.work_number || !values.contact_information.work_number.phone_number) {
        contactErrors.work_number = 'Work number is required';
      }
  
      // Validate emergency_number
      if (!values.contact_information.emergency_number || !values.contact_information.emergency_number.phone_number) {
        contactErrors.emergency_number = 'Emergency number is required';
      }
      if (Object.keys(contactErrors).length > 0) {
        errors.contact_information = contactErrors;
      }
    
  
    // Validate password
    if (!values.password) {
      errors.password = 'Password is required';
    }
  
    // Validate confirm_password
    if (!values.confirm_password) {
      errors.confirm_password = 'Confirm password is required';
    } else if (values.confirm_password !== values.password) {
      errors.confirm_password = 'Passwords do not match';
    }
  
    return errors;
  }
  