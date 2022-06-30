const FormType = {
  field: 'field',
  upload: 'upload',
  radio: 'radio',
};

export const editProfileFormFields = [
  {
    key: 'userInfo',
    title: 'User Info',
    fields: [
      {
        type: FormType.field,
        key: 'userName',
        default: '',
        title: 'Username',
        isRequired: true,
        placeholder: 'Enter Username',
        description: '',
      },
      {
        type: FormType.field,
        key: 'cnsName',
        default: '',
        title: 'Custom URL',
        isRequired: true,
        placeholder: 'Enter your custom URL',
        description: 'Your .CRO domain must be set at cronos.domains for sync to work',
      },
      {
        type: FormType.field,
        key: 'email',
        default: '',
        title: 'Email Address',
        isRequired: true,
        placeholder: 'Enter Email',
        description: '',
      },
      {
        type: FormType.field,
        key: 'twitter',
        default: '',
        title: 'Twitter Handle',
        isRequired: true,
        placeholder: 'Enter Twitter Handle',
        description: '',
      },
      {
        type: FormType.field,
        key: 'instagram',
        default: '',
        title: 'Instagram Handle',
        isRequired: true,
        placeholder: 'Enter Instagram Handle',
        description: '',
      },
      {
        type: FormType.field,
        key: 'discord',
        default: '',
        title: 'Discord ID',
        isRequired: true,
        placeholder: 'Enter Discord ID',
        description: '',
      },
      {
        type: FormType.field,
        key: 'website',
        default: '',
        title: 'Website',
        isRequired: true,
        placeholder: 'Enter Website URL',
        description: '',
      },
    ],
  },
  {
    key: 'userInfo',
    title: 'Upload Assets',
    fields: [
      {
        key: 'profilePicture',
        type: 'upload',
        title: 'Upload Avatar',
        default: [],
        isRequired: true,
        description: '',
      },
    ],
  },
  {
    key: 'userInfo',
    title: 'Upload Assets',
    fields: [
      {
        key: 'uploadBanner',
        type: 'upload',
        title: 'Upload Banner',
        default: [],
        isRequired: true,
        description: '',
      },
    ],
  },
];

export const initialValues = editProfileFormFields.reduce(
  (values, subForm) => ({
    ...values,
    [subForm.key]: subForm.fields.reduce(
      (fieldValues, field) => ({
        ...fieldValues,
        [field.key]: field.default,
      }),
      {}
    ),
  }),
  {}
);
