export const ADULT = {
  FormName: 'Initial Adult Visit Form',
  Tabs: [
    {
      TabName: 'Visit',
      Sections: [
        {
          Questions: [
            {
              QuestionName: 'Visit Number',
              InputType: 'Number',
              OldDBLocation: 'VisitNumber',
              OldDBType: 'int(3)'
            },
            {
              QuestionName: 'OS ID',
              InputType: 'Number',
              OldDBLocation: 'WKOID',
              OldDBType: 'int(4)'
            },
            {
              QuestionName: 'Client ID',
              InputType: 'Number',
              OldDBLocation: 'ClientID',
              OldDBType: 'int(5)'
            },
            {
              QuestionName: 'Family ID',
              InputType: 'Number',
              OldDBLocation: 'FamilyID',
              OldDBType: 'int(5)'
            },
            {
              QuestionName: 'Time Start',
              InputType: 'Time',
              OldDBLocation: 'StartTime',
              OldDBType: 'time'
            },
            {
              QuestionName: 'Time End',
              InputType: 'Time',
              OldDBLocation: 'EndTime',
              OldDBType: 'time'
            },
            {
              QuestionName: 'Visit Date',
              InputType: 'Date',
              OldDBLocation: 'VisitDate',
              OldDBType: 'date'
            },
            {
              QuestionName: 'Initial Visit Date',
              InputType: 'Date',
              OldDBLocation: 'InitialVisitDate',
              OldDBType: 'date'
            },
            {
              QuestionName: 'Last Visit Date',
              InputType: 'Date',
              OldDBLocation: 'LastVisitDate',
              OldDBType: 'date'
            },
            {
              QuestionName: 'Client Level',
              InputType: 'Select',
              OldDBLocation: 'ClientLevel',
              OldDBType: 'varchar(45)',
              Options: ['1P2', '1P4', '1', '1SS', '2', '3', '4', 'X']
            },
            {
              QuestionName: 'Client Score',
              InputType: 'Number',
              OldDBLocation: 'ClientScore',
              OldDBType: 'varchar(45)'
            },
            {
              QuestionName: 'Client Type',
              InputType: 'Checkbox',
              OldDBLocation: 'ClientType',
              OldDBType: 'varchar(50)',
              Options: [
                'HFA',
                'A2A',
                'MO HV',
                {
                  Other: {
                    InputType: 'Text',
                    OldDBLocation: 'ClientType',
                    OldDBType: 'varchar(50)',
                    OldDBNote: 'Hopefully'
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      TabName: 'General',
      Sections: [
        {
          Questions: [
            {
              QuestionName: 'Client Referal Source',
              InputType: 'Text',
              OldDBLocation: 'ReferredBy',
              OldDBType: 'text'
            },
            {
              QuestionName: 'Previous Client',
              InputType: 'Checkbox',
              OldDBLocation: 'PreviousClient',
              OldDBType: 'tinyint'
            },
            {
              QuestionName: 'Parent Aide',
              InputType: 'Checkbox',
              OldDBLocation: 'ParentAide',
              OldDBType: 'tinyint(1)'
            },
            {
              QuestionName: "Children's Division",
              InputType: 'Checkbox',
              OldDBLocation: 'DFS',
              OldDBType: 'tinyint(1)'
            }
          ]
        }
      ]
    },
    {
      TabName: 'Demographic',
      Sections: [
        {
          SectionName:
            'Primary Care Giver/Pregnant Mom Demographic Information',
          Questions: [
            {
              QuestionName: "Client's Name",
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'First Name',
                  InputType: 'Text',
                  OldDBLocation: 'First',
                  OldDBType: 'varchar(20)'
                },
                {
                  QuestionName: 'Last Name',
                  InputType: 'Text',
                  OldDBLocation: 'Last',
                  OldDBType: 'varchar(20)'
                }
              ]
            },
            {
              QuestionName: 'Date of Birth',
              InputType: 'Date',
              OldDBLocation: 'DateOfBirth',
              OldDBType: 'date'
            },
            {
              QuestionName: 'Age (years)',
              InputType: 'Number',
              OldDBLocation: 'AgeYears',
              OldDBType: 'int(3)'
            },
            {
              QuestionName: 'Social Security Number',
              InputType: 'SSN',
              OldDBLocation: 'SSN',
              OldDBType: 'varchar(20)'
            },
            {
              QuestionName: 'Marital Status',
              InputType: 'Radio',
              OldDBLocation: 'MaritalStatus',
              OldDBType: 'varchar(50)',
              Options: [
                'Single, never married',
                'Married',
                'Separated',
                'Divorced',
                'Widowed'
              ]
            },
            {
              QuestionName: 'Street Address',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'PO Box',
                  InputType: 'Text',
                  OldDBLocation: 'POBox',
                  OldDBType: 'varchar(20)'
                },
                {
                  QuestionName: 'Address',
                  InputType: 'Text',
                  OldDBLocation: 'Address',
                  OldDBType: 'varchar(75)'
                },
                {
                  QuestionName: 'APT',
                  InputType: 'Text',
                  OldDBLocation: 'AptNo',
                  OldDBType: 'varchar(5)'
                },
                {
                  QuestionName: 'CITY',
                  InputType: 'Text',
                  OldDBLocation: 'City',
                  OldDBType: 'varchar(40)'
                },
                {
                  QuestionName: 'STATE',
                  InputType: 'Text',
                  OldDBLocation: 'State',
                  OldDBType: 'varchar(20)'
                },
                {
                  QuestionName: 'ZIP',
                  InputType: 'Text',
                  OldDBLocation: 'Zip',
                  OldDBType: 'varchar(10)'
                }
              ]
            },
            {
              QuestionName: 'Home Phone Number',
              InputType: 'US Phone Number',
              OldDBLocation: 'HomePhone',
              OldDBType: 'HomePhone'
            },
            {
              QuestionName: 'Work Phone Number',
              InputType: 'US Phone Number',
              OldDBLocation: 'WorkPhone',
              OldDBType: 'WorkPhone'
            },
            {
              QuestionName: 'Other Phone Number',
              InputType: 'US Phone Number',
              OldDBLocation: 'OtherPhone',
              OldDBType: 'OtherPhone'
            },
            {
              QuestionName: 'County',
              InputType: 'Radio',
              OldDBLocation: 'County',
              OldDBType: 'varchar(50)',
              Options: [
                'Butler',
                'Carter',
                'Iron',
                'Reynolds',
                'Shannon',
                'Wayne',
                {
                  Other: {
                    InputType: 'Text',
                    OldDBLocation: 'County',
                    OldDBType: 'varchar(50)',
                    OldDBNote: 'Hopefully'
                  }
                }
              ]
            },
            {
              QuestionName: 'Lives With',
              InputType: 'Checkboxes',
              OldDBLocation: 'HousingStatus',
              OldDBType: 'varchar(100)',
              Options: [
                'Alone',
                'Spouse',
                'Significant Other',
                'Parents',
                'In-Laws',
                'Friend/Other Family',
                'Shelter'
              ]
            },
            {
              QuestionName: 'Gender',
              InputType: 'Radio',
              OldDBLocation: 'Gender',
              OldDBType: 'varchar(6)',
              Options: ['male', 'female']
            },
            {
              QuestionName: 'Height',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'ft',
                  InputType: 'Number',
                  OldDBLocation: 'PregnantHeightFeet',
                  OldDBType: 'int'
                },
                {
                  QuestionName: 'in',
                  InputType: 'Number',
                  OldDBLocation: 'PregnantHeightInches',
                  OldDBType: 'int'
                }
              ]
            },
            {
              QuestionName: 'Weight',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Current Weight(lbs)',
                  InputType: 'Number',
                  OldDBLocation: 'CurrentWeight',
                  OldDBType: 'int(3)'
                },
                {
                  QuestionName: 'Old Weight(lbs)',
                  InputType: 'CalculatedNumber'
                },
                {
                  QuestionName: 'Weight Change(lbs)',
                  InputType: 'CalculatedNumber',
                  OldDBLocation: 'WeightChange',
                  OldDBType: 'int(3)'
                },
                {
                  QuestionName: 'New BMI',
                  InputType: 'CalculatedNumber',
                  OldDBLocation: 'BMI',
                  OldDBType: 'int(4)'
                },
                {
                  QuestionName: 'Unknown',
                  InputType: 'Checkbox',
                  OldDBLocation: 'WeightBeforePregnant',
                  OldDBType: 'varchar(18)'
                },
                {
                  QuestionName: 'Refused',
                  InputType: 'Checkbox',
                  OldDBLocation: 'WeightBeforePregnant',
                  OldDBType: 'varchar(18)'
                }
              ]
            },
            {
              QuestionName: 'Race',
              InputType: 'Checkboxes',
              OldDBLocation: 'Race',
              OldDBType: 'varchar(200)',
              Options: [
                'African American',
                'Asian or Pacific Islander',
                'Caucasian',
                'Hispanic',
                {
                  Other: {
                    InputType: 'Text',
                    OldDBLocation: 'Race',
                    OldDBType: 'varchar(200)',
                    OldDBNote: 'Hopefully'
                  }
                }
              ]
            },
            {
              QuestionName: 'Employment Status',
              InputType: 'Checkboxes',
              OldDBLocation: 'EmploymentStatus',
              OldDBType: 'varchar(100)',
              Options: [
                'Employed Full Time (At least 32 hrs/week)',
                'Employed Part Time (20 - 31 hrs/week)',
                'Employed Part Time (Less than 20 hrs/week',
                'Unemployed (At this time)',
                'High School Student',
                'College Student',
                'Disabled',
                'Retired',
                'FT Stay-At-Home Parent'
              ],
              Note:
                'There is logic on the input that only allows combinations that make sense'
            },
            {
              QuestionName: 'Lost Employment Since Last Visit',
              InputType: 'Checkbox',
              OldDBLocation: 'LostEmploymentSinceLastVisit',
              OldDBType: 'tinyint'
            },
            {
              QuestionName: 'Name of Parenting Partner',
              InputType: 'Text',
              OldDBLocation: 'ParentingPartnerName',
              OldDBType: 'text'
            },
            {
              QuestionName: 'Relationship',
              InputType: 'Text',
              OldDBLocation: 'ParentingPartnerRelationship',
              OldDBType: 'text'
            },
            {
              QuestionName: 'Parenting Partner Employment Status',
              InputType: 'Checkboxes',
              OldDBLocation: 'EmploymentStatusPartentingPartner',
              OldDBType: 'text',
              Options: [
                'Employed Full Time (At least 32 hrs/week)',
                'Employed Part Time (20 - 31 hrs/week)',
                'Employed Part Time (Less than 20 hrs/week',
                'Unemployed (At this time)',
                'High School Student',
                'College Student',
                'Disabled',
                'Retired',
                'FT Stay-At-Home Parent'
              ],
              Note:
                'There is logic on the input that only allows combinations that make sense'
            },
            {
              QuestionName:
                'Parenting Partner Lost Employment Since Last Visit',
              InputType: 'Checkbox',
              OldDBLocation: 'LostEmploymentSinceLastVisitPartentingPartner',
              OldDBType: 'tinyint'
            },
            {
              QuestionName: 'Household Income',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Weekly($)',
                  InputType: 'Number',
                  OldDBLocation: 'FamilyWeeklyIncome',
                  OldDBType: 'varchar(7)'
                },
                {
                  QuestionName: 'Monthly($)',
                  InputType: 'Number',
                  OldDBLocation: 'FamilyMonthlyIncome',
                  OldDBType: 'varchar(7)'
                },
                {
                  QuestionName: 'Yearly($)',
                  InputType: 'Number',
                  OldDBLocation: 'FamilyYearlyIncome',
                  OldDBType: 'varchar(7)'
                },
                {
                  QuestionName: 'Members in Household',
                  InputType: 'Number',
                  OldDBLocation: 'HouseMembers',
                  OldDBType: 'int(4)'
                }
              ]
            },
            {
              QuestionName: 'Relationship to Child(ren)',
              InputType: 'Radio',
              OldDBLocation: 'RelationshipToChild',
              OldDBType: 'varchar(200)',
              Options: [
                'Birth parent',
                'Pregnant mom',
                'Adopted parent',
                'Step parent',
                'Grandparent',
                'Family member',
                'Legal Guardian',
                {
                  Other: {
                    InputType: 'Text',
                    OldDBLocation: 'RelationshipToChild',
                    OldDBType: 'varchar(200)',
                    OldDBNote: 'Hopefully'
                  }
                }
              ]
            },
            {
              QuestionName: 'Emergency Contact Information',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Name',
                  InputType: 'Text',
                  OldDBLocation: 'EmergencyContactName',
                  OldDBType: 'varchar(50)'
                },
                {
                  QuestionName: 'Relationship',
                  InputType: 'Text',
                  OldDBLocation: 'EmergencyContactRelationship',
                  OldDBType: 'varchar(50)'
                },
                {
                  QuestionName: 'Home Phone Number',
                  InputType: 'US Phone Number',
                  OldDBLocation: 'EmergencyContactHomePhone',
                  OldDBType: 'varchar(12)'
                },
                {
                  QuestionName: 'Work Phone Number',
                  InputType: 'US Phone Number',
                  OldDBLocation: 'EmergencyContactWorkPhone',
                  OldDBType: 'varchar(12)'
                },
                {
                  QuestionName: 'Other Phone Number',
                  InputType: 'US Phone Number',
                  OldDBLocation: 'EmergencyContactOtherPhone',
                  OldDBType: 'varchar(12)'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      TabName: 'Medical',
      Sections: [
        {
          SectionName: 'Medical Information',
          Questions: [
            {
              QuestionName: "Doctor's Name",
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'First',
                  InputType: 'Text',
                  OldDBLocation: 'DoctorsFirstName',
                  OldDBType: 'varchar(45)'
                },
                {
                  QuestionName: 'Last',
                  InputType: 'Text',
                  OldDBLocation: 'DoctorsLastName',
                  OldDBType: 'varchar(50)'
                }
              ]
            },
            {
              QuestionName: 'Type of Insurance',
              InputType: 'Checkboxes',
              OldDBLocation: 'Insurance',
              OldDBType: 'varchar(100)',
              Options: [
                'No Insurance',
                {
                  Medicaid: {
                    InputType: 'QuestionGroup',
                    SubQuestions: [
                      {
                        QuestionName: 'Medicaid #',
                        InputType: 'Text',
                        OldDBLocation: 'MedicaidNumber',
                        OldDBType: 'varchar(20)'
                      },
                      {
                        QuestionName: 'Pending',
                        InputType: 'Checkbox',
                        OldDBLocation: 'MedicaidPending',
                        OldDBType: 'tinyint'
                      },
                      {
                        QuestionName: 'Inactive',
                        InputType: 'Checkbox',
                        OldDBLocation: 'MedicaidInactive',
                        OldDBType: 'tinyint(1)'
                      }
                    ]
                  }
                },
                {
                  'Other Insurance': {
                    InputType: 'Text',
                    OldDBLocation: 'Insurance',
                    OldDBType: 'varchar(100)',
                    OldDBNote: 'Hopefully'
                  }
                }
              ]
            },
            {
              QuestionName: 'Type of Aid',
              InputType: 'Checkboxes',
              OldDBLocation: 'TypeOfAide',
              OldDBType: 'varchar(120)',
              Options: [
                'TANF (AFDC)',
                'Dept. Mental Health',
                'SSI',
                'WIC',
                'Food Stamps',
                {
                  'Other Aid': {
                    InputType: 'Text',
                    OldDBLocation: 'TypeOfAide',
                    OldDBType: 'varchar(120)',
                    OldDBNote: 'Hopefully'
                  }
                }
              ]
            }
          ]
        },
        {
          SectionName: 'Medical Visits - scheduled',
          Questions: [
            {
              QuestionName: 'Last Clinic Visit',
              InputType: 'Date',
              OldDBLocation: 'LastClinicVisitDate',
              OldDBType: 'date'
            },
            {
              QuestionName: 'Next Clinic Visit',
              InputType: 'Date',
              OldDBLocation: 'NextClinicVisitDate',
              OldDBType: 'date'
            },
            {
              QuestionName: 'Not Scheduled',
              InputType: 'Checkbox',
              OldDBLocation: 'NextClinicNotSched',
              OldDBType: 'int(1)'
            },
            {
              QuestionName: 'Kept last appointment',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'KeptLastAppointment',
              OldDBType: 'tinyint',
              ConditionalInput: {
                Condition: 'No',
                QuestionName: 'Specify',
                InputType: 'TextArea',
                OldDBLocation: 'KeptLastAppointmentSpecify',
                OldDBType: 'longtext'
              }
            }
          ]
        },
        {
          SectionName: 'Medical Visits - unscheduled',
          Questions: [
            {
              QuestionName:
                'Has the client seen another healthcare provider since the last home visit?',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'UnscheduledVisit',
              OldDBType: 'tinyint',
              ConditionalInput: {
                QuestionName: 'Specify',
                InputType: 'TextArea',
                OldDBLocation: 'UnscheduledVisitSpecify',
                OldDBType: 'longtext'
              }
            }
          ]
        },
        {
          SectionName: 'Medical Visits - specialist',
          Questions: [
            {
              QuestionName:
                'Has the client seen a specialist since the last visit?',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'SeenSpecialist',
              OldDBType: 'tinyint',
              ConditionalInput: {
                QuestionName: 'Specialist 1',
                InputType: 'QuestionGroup',
                SubQuestions: [
                  {
                    QuestionName: '',
                    InputType: 'QuestionGroup',
                    SubQuestions: [
                      {
                        QuestionName: 'Specialist 1 Name',
                        InputType: 'Text',
                        OldDBLocation: 'SpecialistLastName',
                        OldDBType: 'varchar(75)'
                      },
                      {
                        QuestionName: 'Specialty 1',
                        InputType: 'Text',
                        OldDBLocation: 'SpecialistField',
                        OldDBType: 'varchar(45)'
                      },
                      {
                        QuestionName: 'Last Visit 1',
                        InputType: 'Text',
                        OldDBLocation: 'SpecialistLastVisit',
                        OldDBType: 'varchar(10)'
                      },
                      {
                        QuestionName: 'Next Visit 1',
                        InputType: 'Text',
                        OldDBLocation: 'SpecialistNextVisit',
                        OldDBType: 'varchar(10)'
                      },
                      {
                        QuestionName: 'Not Scheduled 1',
                        InputType: 'Checkbox',
                        OldDBLocation: 'SpecialistNextNotSched',
                        OldDBType: 'int(1)'
                      },
                      {
                        QuestionName: 'Kept last appointment 1',
                        InputType: 'Radio',
                        OldDBLocation: 'KeptLastSpecialistAppointment1',
                        OldDBType: 'tinyint'
                      }
                    ]
                  },
                  {
                    QuestionName: 'Specialist 2',
                    InputType: 'QuestionGroup',
                    SubQuestions: [
                      {
                        QuestionName: 'Specialist 2 Name',
                        InputType: 'Text',
                        OldDBLocation: 'SpecialistLastName2',
                        OldDBType: 'varchar(150)'
                      },
                      {
                        QuestionName: 'Specialty 2 - TEXT',
                        InputType: 'Text',
                        OldDBLocation: 'SpecialistField2',
                        OldDBType: 'varchar(150)'
                      },
                      {
                        QuestionName: 'Last Visit 2 - TEXT',
                        InputType: 'Text',
                        OldDBLocation: 'Specialist2LastVisit',
                        OldDBType: 'varchar(10)'
                      },
                      {
                        QuestionName: 'Next Visit 2 - TEXT',
                        InputType: 'Text',
                        OldDBLocation: 'Specialist2NextVisit',
                        OldDBType: 'varchar(10)'
                      },
                      {
                        QuestionName: 'Not Scheduled 2',
                        InputType: 'Checkbox',
                        OldDBLocation: 'Specialist2NextNotSched',
                        OldDBType: 'int(1)'
                      },
                      {
                        QuestionName: 'Kept last appointment 2',
                        InputType: 'Radio',
                        OldDBLocation: 'KeptLastSpecialistAppointment2',
                        OldDBType: 'tinyint'
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        {
          SectionName: 'Medical History',
          Questions: [
            {
              QuestionName: 'Allergies',
              InputType: 'Checkbox',
              OldDBLocation: 'Allergies',
              OldDBType: 'tinyint(1)'
            },
            {
              QuestionName: 'Diabetes',
              InputType: 'Checkbox',
              OldDBLocation: 'Diabetes',
              OldDBType: 'tinyint(1)'
            },
            {
              QuestionName: 'Smoker(present)-Client',
              InputType: 'Checkbox',
              OldDBLocation: 'SmokerClient',
              OldDBType: 'tinyint'
            },
            {
              QuestionName: 'Smoker (present)-Household Members, Friends, etc.',
              InputType: 'Checkbox',
              OldDBLocation: 'SmokerHousehold',
              OldDBType: 'tinyint'
            },
            {
              QuestionName: 'Heart disease',
              InputType: 'Checkbox',
              OldDBLocation: 'HeartDisease',
              OldDBType: 'tinyint(1)'
            },
            {
              QuestionName: 'HIV Positive',
              InputType: 'Checkbox',
              OldDBLocation: 'HIVpositive',
              OldDBType: 'tinyint(1)'
            },
            {
              QuestionName: 'Hypertension',
              InputType: 'Checkbox',
              OldDBLocation: 'Hypertension',
              OldDBType: 'tinyint(1)'
            },
            {
              QuestionName: 'Kidney disease',
              InputType: 'Checkbox',
              OldDBLocation: 'KidneyDisease',
              OldDBType: 'tinyint(1)'
            },
            {
              QuestionName: 'Psychiactric history',
              InputType: 'Checkbox',
              OldDBLocation: 'PsychiatricHistory',
              OldDBType: 'tinyint(1)'
            },
            {
              QuestionName: 'Seizure disorder',
              InputType: 'Checkbox',
              OldDBLocation: 'SeizureDisorder',
              OldDBType: 'tinyint(1)'
            },
            {
              QuestionName: 'Cervical problems',
              InputType: 'Checkbox',
              OldDBLocation: 'CervicalProblems',
              OldDBType: 'tinyint(1)'
            },
            {
              QuestionName: "STD's",
              InputType: 'Checkbox',
              OldDBLocation: 'STDs',
              OldDBType: 'tinyint(1)'
            },
            {
              QuestionName: 'Other',
              InputType: 'Checkbox',
              OldDBLocation: 'OtherHistory',
              OldDBType: 'tinyint(1)',
              ConditionalInput: {
                Condition: 'Yes',
                QuestionName: 'Specify',
                InputType: 'TextArea',
                OldDBLocation: 'OtherHistorySpecify',
                OldDBType: 'longtext'
              }
            },
            {
              QuestionName: 'History of abuse',
              InputType: 'Checkbox',
              OldDBLocation: 'HistoryOfAbuse',
              OldDBType: 'tinyint',
              ConditionalInput: {
                Condition: 'Yes',
                QuestionName: 'Specify',
                InputType: 'TextArea',
                OldDBLocation: 'SpecifyHistoryOfAbuse',
                OldDBType: 'longtext'
              }
            },
            {
              QuestionName: 'Abuse Record has changed',
              InputType: 'Checkbox',
              OldDBLocation: 'HistoryOfAbuseChanged',
              OldDBType: 'tinyint'
            }
          ]
        },
        {
          SectionName: 'Counseling and Therapy',
          Questions: [
            {
              QuestionName: 'Currently seeing a counselor or therapist?',
              InputType: 'Radio',
              OldDBLocation: 'Therapy',
              OldDBType: 'tinyint(1)',
              ConditionalInput: {
                Condition: 'Yes',
                InputType: 'QuestionGroup',
                SubQuestions: [
                  {
                    QuestionName: 'Date of last therapy session',
                    InputType: 'Date',
                    OldDBLocation: 'DateOfTherapy',
                    OldDBType: 'date'
                  },
                  {
                    QuestionName: 'Date of next therapy session',
                    InputType: 'Date',
                    OldDBLocation: 'DateOfNextTherapy',
                    OldDBType: 'date'
                  },
                  {
                    QuestionName: 'Kept last appointment',
                    InputType: 'Radio',
                    OldDBLocation: 'KeptLastTherapyAppointment',
                    OldDBType: 'tinyint'
                  },
                  {
                    QuestionName: 'Name of conselor/therapist',
                    InputType: 'QuestionGroup',
                    SubQuestions: [
                      {
                        QuestionName: 'First',
                        InputType: 'Text',
                        OldDBLocation: 'FirstNameOfTherapist',
                        OldDBType: 'varchar(45)'
                      },
                      {
                        QuestionName: 'Last',
                        InputType: 'Text',
                        OldDBLocation: 'LastNameOfTherapist',
                        OldDBType: 'varchar(100)'
                      }
                    ]
                  },
                  {
                    QuestionName: 'Specify current medical conditions',
                    InputType: 'TextArea',
                    OldDBLocation: 'SpecifyCurrentMedicalConditions',
                    OldDBType: 'longtext'
                  }
                ]
              }
            }
          ]
        },
        {
          SectionName: 'Depression Scale Scores',
          Note: 'Can have up to ten scores/dates (Score1..10)',
          Questions: [
            {
              QuestionName: 'Depression Score',
              InputType: 'Number',
              OldDBLocation: 'DepressionScore1',
              OldDBType: 'int(4)'
            },
            {
              QuestionName: 'Date of Score',
              InputType: 'Date',
              OldDBLocation: 'DepressionScore1Date',
              OldDBType: 'date'
            }
          ]
        }
      ]
    },
    {
      TabName: 'Pregnancy',
      Sections: [
        {
          SectionName: 'Pregnancy Information',
          Questions: [
            {
              QuestionName: 'Currently Pregnant',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'PregnancySectionDoesNotApplytoFamily tinyint(1)',
              ConditionalInput: {
                Condition: 'Yes',
                InputType: 'QuestionGroup',
                SubQuestions: [
                  {
                    QuestionName: 'Due Date',
                    InputType: 'Date',
                    OldDBLocation: 'PregnancyDueDate date'
                  },
                  {
                    QuestionName: 'Trimester',
                    InputType: 'Number',
                    OldDBLocation: 'PregnancyTrimester int'
                  },
                  {
                    QuestionName: 'Current Gestational Age',
                    InputType: 'Number',
                    OldDBLocation: 'GestionalAgeWeeks int(2)'
                  },
                  {
                    QuestionName: 'Currently receiving prenatal care?',
                    InputType: 'Radio',
                    OldDBLocation: 'ReceivingPrenatalCare tinyint(1)'
                  },
                  {
                    QuestionName: 'Is this pregnancy wanted now?',
                    InputType: 'Radio',
                    OldDBLocation: 'PregnancyWanted tinyint(1)'
                  }
                ]
              }
            },
            {
              QuestionName: 'Subsequent Program Pregnancy',
              InputType: 'Checkbox',
              OldDBLocation: 'SubsequentProgramPregnancy tinyint(1)'
            }
          ]
        },
        {
          Questions: [
            {
              QuestionName: 'Number of pregnancies',
              InputType: 'Number',
              OldDBLocation: 'NumberOfPregnancies int'
            },
            {
              QuestionName: 'Date of last delivery',
              InputType: 'Date',
              OldDBLocation: 'DateOfLastDelivery date'
            }
          ]
        },
        {
          Questions: [
            {
              QuestionName:
                'In your previous pregnancy(ies), did you have any complications?',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'PreviousPregnancyComplications tinyint(1)',
              ConditionalInput: {
                Condition: 'Yes',
                InputType: 'QuestionGroup',
                SubQuestions: [
                  {
                    QuestionName: '# of induced miscarriages',
                    InputType: 'Number',
                    OldDBLocation: 'NumberOfInducedPregnancies int'
                  },
                  {
                    QuestionName: '# of spontaneous miscarriages',
                    InputType: 'Number',
                    OldDBLocation: 'NumberOfSpontaneousMiscarriages int'
                  },
                  {
                    QuestionName: '# of fetal deaths (>= 20 wks)',
                    InputType: 'Number',
                    OldDBLocation: 'NumberOfFetalDeaths int'
                  },
                  {
                    QuestionName: '# of live births',
                    InputType: 'Number',
                    OldDBLocation: 'NumberOfLiveBirths int'
                  },
                  {
                    QuestionName: '# of neonatal deaths',
                    InputType: 'Number',
                    OldDBLocation: 'NumberOfNeonatalDeaths int'
                  },
                  {
                    QuestionName: '# of living children',
                    InputType: 'Number',
                    OldDBLocation: 'NumberOfLivingChildren int'
                  },
                  {
                    QuestionName: '# of incidents of pre-term labors',
                    InputType: 'Number',
                    OldDBLocation: 'NumberOfIncididentsOfPretermLabor int'
                  },
                  {
                    QuestionName: '# of pre-term deliveries(< 37 weeks)',
                    InputType: 'Number',
                    OldDBLocation: 'NumberOfPretermDeliveries int'
                  },
                  {
                    QuestionName:
                      '# of low birth weight babies (<= 5 lb. 8 oz.)',
                    InputType: 'Number',
                    OldDBLocation: 'NumberOfLowBirthRateBabies int'
                  },
                  {
                    QuestionName: '# of multi gestations',
                    InputType: 'Number',
                    OldDBLocation: 'NumberOfMultiGestations int'
                  },
                  {
                    QuestionName: '# of C-sections',
                    InputType: 'Number',
                    OldDBLocation: 'NumberOfCsections int'
                  },
                  {
                    QuestionName: '# of labor/delivery complications',
                    InputType: 'Number',
                    OldDBLocation: 'NumberOfLaborComplications int'
                  }
                ]
              }
            },
            {
              QuesetionName:
                'What health or medical concerns do you have based on past or present pregnancy?',
              InputType: 'Textarea',
              OldDBLocation: 'PregnancyConcerns longtext'
            },
            {
              QuestionName:
                'Average weight gain or loss during previous pregnancies?',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'lbs',
                  InputType: 'Number',
                  OldDBLocation: 'WeightGainedDuringPregnancy varchar(18)'
                },
                {
                  QuestionName: 'Unknown',
                  InputType: 'Checkbox',
                  OldDBLocation:
                    '`Unknown/Refused` varchar(10)??WeightGainedDuringPregnancy varchar(18)'
                },
                {
                  QuestionName: 'Refused',
                  InputType: 'Checkbox',
                  OldDBLocation:
                    '`Unknown/Refused` varchar(10)??WeightGainedDuringPregnancy varchar(18)'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      TabName: 'Service',
      Sections: [
        {
          SectionName:
            'Primary Care Giver/Pregnant Mom Community Service Information',
          Questions: [
            {
              QuestionName: 'Does the client participate in the community?',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'ParticipationInCommunity varchar(100)',
              OldDBNote:
                'Why is the record so large, is there anything else there?',
              ConditionalInput: {
                Condition: 'Yes',
                QuestionName: 'Where?',
                InputType: 'Checkboxes',
                OldDBLocation: 'ParticipationInCommunityWhere varchar(100)',
                Options: [
                  'Community Club',
                  'Church Group',
                  {
                    Other: {
                      QuestionName: 'Specify',
                      InputType: 'Text',
                      OldDBLocation:
                        'ParticipationInCommunityWhere varchar(100)',
                      OldDBNote: 'Hopefully'
                    }
                  }
                ]
              }
            }
          ]
        },
        {
          SectionName:
            'Primary Care Giver/Pregnant Mom Volunteer Hours Information',
          Questions: [
            {
              QuestionName: 'New Total Volunteer Hours',
              InputType: 'Number',
              OldDBLocation: 'TotalVolunteerHours int'
            }
          ]
        },
        {
          SectionName: 'Employment Skills Information',
          SectionNote:
            'Each section of this assesment has 5 questions, positive choices = 1 point',
          Questions: [
            {
              QuestionName: '1. Attitude',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Q1',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_1_1 tinyint(1)',
                  Options: [
                    'Traits of healthy self-esteem',
                    "Sees self as a 'victim'"
                  ]
                },
                {
                  QuestionName: 'Q2',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_1_2 tinyint(1)',
                  Options: [
                    'Able to laugh and smile frequently',
                    'Shows little humor/smiles infrequently'
                  ]
                },
                {
                  QuestionName: 'Q3',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_1_3 tinyint(1)',
                  Options: [
                    'Speaks positively of self/identifies strengths',
                    'Speaks negatively of self'
                  ]
                },
                {
                  QuestionName: 'Q4',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_1_4 tinyint(1)',
                  Options: [
                    'Identifies stressors/healthy stress relief ideas',
                    'Constantly involved in stressful situations'
                  ]
                },
                {
                  QuestionName: 'Q5',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_1_5 tinyint(1)',
                  Options: [
                    'Identifies/Uses resources available to them',
                    'No effort to change unhealthy situations'
                  ]
                },
                {
                  QuestionName: 'Score',
                  InputType: 'Number',
                  OldDBLocation: 'employment_skills_1_total tinyint(1)'
                }
              ]
            },
            {
              QuestionName: '2. Responsibility',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Q1',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_2_1 tinyint(1)',
                  Options: [
                    'Identifies responsibility',
                    'Continually blames others for circumstances'
                  ]
                },
                {
                  QuestionName: 'Q2',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_2_2 tinyint(1)',
                  Options: [
                    'Can identify personal values/principles',
                    'Unable to list personal values/principles'
                  ]
                },
                {
                  QuestionName: 'Q3',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_2_3 tinyint(1)',
                  Options: [
                    'Makes and keeps commitments',
                    'Repeatedly breaks commitments'
                  ]
                },
                {
                  QuestionName: 'Q4',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_2_4 tinyint(1)',
                  Options: [
                    'Realizes that success requires persistence',
                    'Expects solutions to be provided for him/her'
                  ]
                },
                {
                  QuestionName: 'Q5',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_2_5 tinyint(1)',
                  Options: [
                    'Is proactive in making life changes',
                    'Gives up when faced with obstacles'
                  ]
                },
                {
                  QuestionName: 'Score',
                  InputType: 'Number',
                  OldDBLocation: 'employment_skills_2_total tinyint(1)'
                }
              ]
            },
            {
              QuestionName: '3. Communication',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Q1',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_3_1 tinyint(1)',
                  Options: ['Positive body language', 'Negative body language']
                },
                {
                  QuestionName: 'Q2',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_3_2 tinyint(1)',
                  Options: ['Active listening', 'Ineffective listening skills']
                },
                {
                  QuestionName: 'Q3',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_3_3 tinyint(1)',
                  Options: ['Proficient speech', 'Insufficient speech']
                },
                {
                  QuestionName: 'Q4',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_3_4 tinyint(1)',
                  Options: ['Literate', 'Illiterate']
                },
                {
                  QuestionName: 'Q5',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_3_5 tinyint(1)',
                  Options: [
                    "Uses 'I' statements during conflict",
                    "Uses 'you' statements during conflict"
                  ]
                },
                {
                  QuestionName: 'Score',
                  InputType: 'Number',
                  OldDBLocation: 'employment_skills_3_total tinyint(1)'
                }
              ]
            },
            {
              QuestionName: '4. Problem Solving Skills',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Q1',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_4_1 tinyint(1)',
                  Options: [
                    'Able to identify problems',
                    'Requires prompts to recognize problems'
                  ]
                },
                {
                  QuestionName: 'Q2',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_4_2 tinyint(1)',
                  Options: [
                    'Gathers solutions to an identified problem',
                    'Makes little effort to identify solutions'
                  ]
                },
                {
                  QuestionName: 'Q3',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_4_3 tinyint(1)',
                  Options: [
                    'Accepts that the first solution may not work',
                    'Expects immediate results to a problem'
                  ]
                },
                {
                  QuestionName: 'Q4',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_4_4 tinyint(1)',
                  Options: [
                    'Takes healthy risks to solve problems',
                    'Repeats solutions without results'
                  ]
                },
                {
                  QuestionName: 'Q5',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_4_5 tinyint(1)',
                  Options: [
                    'Willing to cooperate with others for a solution',
                    'Resists cooperation with others for a solution'
                  ]
                },
                {
                  QuestionName: 'Score',
                  InputType: 'Number',
                  OldDBLocation: 'employment_skills_4_total tinyint(1)'
                }
              ]
            },
            {
              QuestionName: '5. Workplace Preparation Skills',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Q1',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_5_1 tinyint(1)',
                  Options: [
                    'Uses time-effective time management skills',
                    'Poor time management skills'
                  ]
                },
                {
                  QuestionName: 'Q2',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_5_2 tinyint(1)',
                  Options: [
                    'Understands job satisfaction is not always consistent',
                    'Unrealistic expection about job satisfaction'
                  ]
                },
                {
                  QuestionName: 'Q3',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_5_3 tinyint(1)',
                  Options: [
                    'Learns from mistakes',
                    'Repeats mistakes hoping for different outcomes'
                  ]
                },
                {
                  QuestionName: 'Q4',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_5_4 tinyint(1)',
                  Options: [
                    'Has a positive attitude toward employment',
                    'Has a negative attitude toward employment'
                  ]
                },
                {
                  QuestionName: 'Q5',
                  InputType: 'Radio',
                  OldDBLocation: 'employment_skills_5_5 tinyint(1)',
                  Options: [
                    'Has employment experience',
                    'Has no employment experience'
                  ]
                },
                {
                  QuestionName: 'Score',
                  InputType: 'Number',
                  OldDBLocation: 'employment_skills_5_total tinyint(1)'
                }
              ]
            },
            {
              QuestionName: 'Total Employment Skills Score',
              InputType: 'Number',
              OldDBLocation: 'employment_skills_total_total int(2)'
            }
          ]
        }
      ]
    },

    {
      TabName: 'Education',
      Sections: [
        {
          Questions: [
            {
              QuestionName: 'Pre High School Completion',
              InputType: 'Select',
              OldDBLocation: 'SchoolGrade varchar(15)',
              Options: [
                'Head Start',
                'Kindergarten',
                'First',
                'Second',
                'Third',
                'Fourth',
                'Fifth',
                'Sixth',
                'Seventh',
                'Eighth'
              ]
            }
          ]
        },
        {
          SectionName: 'Current High School Information',
          Questions: [
            {
              QuestionName: 'Currently enrolled in High School?',
              InputType: 'ConditionalInput - Checkbox',
              OldDBLocation: 'EnrolledInHighSchool tinyint(1)',
              ConditionalInput: {
                Condition: 'Yes',
                InputType: 'QuestionGroup',
                SubQuestions: [
                  {
                    QuestionName: 'Current High School Grade',
                    InputType: 'Select',
                    OldDBLocation: 'CurrentGrade varchar(15)',
                    Options: ['Ninth', 'Tenth', 'Eleventh', 'Twelfth']
                  },
                  {
                    QuestionName: 'Where?',
                    InputType: 'Text',
                    OldDBLocation: 'HighSchoolWhere varchar(45)'
                  },
                  {
                    QuestionName: 'Expected Year of High School completion',
                    InputType: 'Number',
                    OldDBLocation: 'ExpectedYearOfHighSchoolGraduation int(4)'
                  }
                ]
              }
            }
          ]
        },
        {
          SectionName: 'Previous High School Information',
          Questions: [
            {
              QuestionName: 'Previously attended High School?',
              InputType: 'Optional Input - Checkbox',
              OldDBLocation: 'AttendedHighSchool tinyint(1)',
              ConditionalInput: {
                Condition: 'Yes',
                InputType: 'QuestionGroup',
                SubQuestions: [
                  {
                    QuestionName: 'Last High School year completed',
                    InputType: 'Select',
                    OldDBLocation: 'PrevGrade varchar(15)',
                    Options: ['Ninth', 'Tenth', 'Eleventh', 'Twelfth']
                  },
                  {
                    QuestionName: 'High School Diploma',
                    InputType: 'ConditionalInput - Checkbox',
                    OldDBLocation: 'HighSchoolDiploma tinyint(1)',
                    ConditionalInput: {
                      Condition: 'Yes',
                      QuestionName: '',
                      InputType: 'Date',
                      OldDBLocation: 'DiplomaDateRecieved varchar(10)'
                    }
                  }
                ]
              }
            }
          ]
        },
        {
          SectionName: 'GED Information',
          Questions: [
            {
              QuestionName: 'Currently Attending GED Classes?',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'AttendingGEDClasses tinyint(1)',
              ConditionalInput: {
                Condition: 'Yes',
                QuestionName: 'Date started',
                InputType: 'Date',
                OldDBLocation: 'GEDClassesDateStarted date'
              }
            },
            {
              QuestionName: 'GED-Date Completed',
              InputType: 'Date',
              OldDBLocation: 'GEDDateCompleted varchar(10)'
            }
          ]
        },
        {
          SectionName: 'College Information',
          Questions: [
            {
              QuestionName: 'College Information',
              InputType: 'Select',
              OldDBLocation: 'CollegeInformation varchar(45)',
              Options: ['College Degree', 'Some College', 'None']
            },
            {
              QuestionName: 'Other Certificates/Licenses held',
              InputType: 'ConditionalInput - Checkbox',
              OldDBLocation: 'OtherCertsLicenses tinyint(1)',
              ConditionalInput: {
                QuestionName: 'Specify',
                InputType: 'TextArea',
                OldDBLocation: 'OtherLicensesHeld longtext'
              }
            }
          ]
        },
        {
          SectionName: 'Vocational School Information',
          Questions: [
            {
              QuestionName: 'Currently Enrolled in a Vocational School?',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'EnrolledInVocationalSchool tinyint(1)',
              ConditionalInput: {
                Condition: 'Yes',
                InputType: 'QuestionGroup',
                SubQuestions: [
                  {
                    QuestionName: 'School name',
                    InputType: 'Text',
                    OldDBLocation: 'VocationalSchoolName varchar(45)'
                  },
                  {
                    QuestionName: 'City',
                    InputType: 'Text',
                    OldDBLocation: 'VocationalSchoolCity varchar(45)'
                  },
                  {
                    QuestionName: 'State',
                    InputType: 'Text',
                    OldDBLocation: 'VocationalSchoolState varchar(45)'
                  },
                  {
                    QuestionName: 'Expected Date of Completion',
                    InputType: 'Date',
                    OldDBLocation: 'ExpectedDateOfVocationalCompletion date'
                  },
                  {
                    QuestionName: 'In what field or area of study',
                    InputType: 'Text',
                    OldDBLocation: 'VocationalFieldOfStudy varchar(45)'
                  },
                  {
                    QuestionName: 'Completion Date',
                    InputType: 'Date',
                    OldDBLocation: 'VocationalCompletionDate date'
                  }
                ]
              }
            }
          ]
        }
      ]
    },

    {
      TabName: 'Referrals',
      Sections: [
        {
          Questions: [
            {
              QuestionName: 'List Of Referrals',
              InputType: 'List/Array',
              List: [
                {
                  InputType: 'QuestionGroup',
                  SubQuestions: [
                    {
                      QuestionName: 'Referral made',
                      InputType: 'Checkbox'
                    },
                    {
                      QuestionName: 'Date of referral',
                      InputType: 'Date'
                    },
                    {
                      QuestionName: 'Referred to',
                      InputType: 'Text'
                    },
                    {
                      QuestionName: 'Utilized',
                      InputType: 'Checkbox'
                    },
                    {
                      QuestionName: 'Last Utilized',
                      InputType: 'Date'
                    },
                    {
                      QuestionName: 'otal Utilized',
                      InputType: 'Number'
                    }
                  ]
                }
              ]
            }
          ],
          OldDBNote:
            'ReferralsMade longtext??ClientReferralUtilization longtext??ReferralJSON longtext??think these are utilized for these fields, need to figure out how it works'
        }
      ]
    },

    {
      TabName: 'Support',
      Sections: [
        {
          SectionName: 'Circle of support',
          Questions: [
            {
              InputType: 'Text',
              OldDBLocation: 'COS1 varchar(45)'
            },
            {
              InputType: 'Text',
              OldDBLocation: 'COS2 varchar(45)'
            },
            {
              InputType: 'Text',
              OldDBLocation: 'COS3 varchar(45)'
            },
            {
              InputType: 'Text',
              OldDBLocation: 'COS4 varchar(45)'
            },
            {
              InputType: 'Text',
              OldDBLocation: 'COS5 varchar(45)'
            },
            {
              InputType: 'Text',
              OldDBLocation: 'COS6 varchar(45)'
            },
            {
              InputType: 'Text',
              OldDBLocation: 'COS7 varchar(45)'
            },
            {
              InputType: 'Text',
              OldDBLocation: 'COS8 varchar(45)'
            },
            {
              InputType: 'Text',
              OldDBLocation: 'COS9 varchar(45)'
            },
            {
              InputType: 'Text',
              OldDBLocation: 'COS10 varchar(45)'
            },
            {
              InputType: 'Text',
              OldDBLocation: 'COS11 varchar(45)'
            },
            {
              InputType: 'Text',
              OldDBLocation: 'COS12 varchar(45)'
            }
          ]
        },
        {
          SectionName: 'Family Goal Plan',
          Questions: [
            {
              QuestionName: 'List of issues/concerns/problems',
              InputType: 'List/Array',
              List: [
                {
                  InputType: 'QuestionGroup',
                  SubQuestions: [
                    {
                      QuestionName: '',
                      InputType: 'List/Array',
                      List: [
                        {
                          QuestionName: 'Mini Goal',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Date',
                              InputType: 'Date'
                            },
                            {
                              QuestionName: 'Mini Goal',
                              InputType: 'Textarea'
                            },
                            {
                              QuestionName: 'Means to complete mini goal',
                              InputType: 'Textarea'
                            },
                            {
                              QuestionName: 'By When?',
                              InputType: 'Date'
                            },
                            {
                              QuestionName: 'Date mini goal reached',
                              InputType: 'Date'
                            },
                            {
                              QuestionName: 'Outcome/Comments',
                              InputType: 'Textarea'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Safety issue',
                          InputType: 'Textarea'
                        },
                        {
                          QuestionName: 'Strengths to build on',
                          InputType: 'Textarea'
                        },
                        {
                          QuestionName: 'Issue Resolved',
                          InputType: 'Checkbox'
                        },
                        {
                          QuestionName: 'Date Resolved',
                          InputType: 'Date'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          OldDBNote:
            'FamilyGoalPlanJSON text??FamilyGoalPlan longtext??Assume all ends up in one of these two'
        }
      ]
    },

    {
      TabName: 'Teaching Topics',
      Sections: [
        {
          Questions: [
            {
              QuestionName: 'Provided information on child development',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'ProvidedChildDevelInfo tinyint(1)',
              ConditionalInput: {
                Condition: 'Yes',
                QuestionName: 'Subject/Topic',
                InputType: 'Text',
                OldDBLocation: 'ProvidedChildDevelInfoSubject text'
              }
            },
            {
              QuestionName:
                'Parent demonstrated new or improved knowledge about child development',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'ProvidedChildDevelInfoImproved tinyint(1)',
              ConditionalInput: {
                Condition: 'yes',
                QuestionName: 'Brief description of what was demonstrated',
                InputType: 'Textarea',
                OldDBLocation: 'ProvidedChildDevelInfoDescription text'
              }
            }
          ]
        },
        {
          SectionName: 'Growing Great Families',
          Description: 'History of Growing Great Families modules used',
          Questions: [
            {
              QuestionName: 'Growing Great Families',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Unit 1',
                  InputType: 'QuestionGroup',
                  SubQuestions: [
                    {
                      QuestionName: 'Module 1A',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit1Mod1A int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit1Mod1ADate date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit1Mod1ATotal int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 1B',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit1Mod1B int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit1Mod1BDate date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit1Mod1BTotal int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 2',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit1Mod2 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit1Mod2Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit1Mod2Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 3',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit1Mod3 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit1Mod3Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit1Mod3Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 4',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit1Mod4 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit1Mod4Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit1Mod4Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 5',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit1Mod5 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit1Mod5Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit1Mod5Total int(4)'
                        }
                      ]
                    }
                  ]
                },
                {
                  QuestionName: 'Unit 2',
                  InputType: 'QuestionGroup',
                  SubQuestions: [
                    {
                      QuestionName: 'Module 1',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit2Mod1 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit2Mod1Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit2Mod1Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 2',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit2Mod2 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit2Mod2Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit2Mod2Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 3',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit2Mod3 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit2Mod3Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit2Mod3Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 4',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit2Mod4 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit2Mod4Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit2Mod4Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 5',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit2Mod5 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit2Mod5Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit2Mod5Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 6',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit2Mod6 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit2Mod6Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit2Mod6Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 7',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit2Mod7 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit2Mod7Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit2Mod7Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 8',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit2Mod8 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit2Mod8Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit2Mod8Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 9',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit2Mod9 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit2Mod9Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit2Mod9Total int(4)'
                        }
                      ]
                    }
                  ]
                },
                {
                  QuestionName: 'Unit 3',
                  InputType: 'QuestionGroup',
                  SubQuestions: [
                    {
                      QuestionName: 'Module 1',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit3Mod1 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit3Mod1Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit3Mod1Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 2',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit3Mod2 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit3Mod2Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit3Mod2Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 3',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit3Mod3 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit3Mod3Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit3Mod3Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 4',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit3Mod4 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit3Mod4Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit3Mod4Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 5',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit3Mod5 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit3Mod5Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit3Mod5Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 6',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit3Mod6 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit3Mod6Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit3Mod6Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 7',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit3Mod7 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit3Mod7Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit3Mod7Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 8',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit3Mod8 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit3Mod8Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit3Mod8Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 9',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit3Mod9 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit3Mod9Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit3Mod9Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 10',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit3Mod10 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit3Mod10Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit3Mod10Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 11',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit3Mod11 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit3Mod11Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit3Mod11Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 12',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'Unit3Mod12 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'Unit3Mod12Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'Unit3Mod12Total int(4)'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              QuestionName: 'Growing Great Kids',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Prenatal',
                  InputType: 'QuestionGroup',
                  SubQuestions: [
                    {
                      QuestionName: 'Unit 1',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Module 1',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN11 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN11Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN11Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 2',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN12 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN12Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN12Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 3',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN13 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN13Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN13Total int(4)'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      QuestionName: 'Unit 2',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Module 1',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN21 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN21Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN21Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 2',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN22 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN22Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN22Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 3',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN23 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN23Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN23Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 4',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN24 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN24Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN24Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 5',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN25 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN25Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN25Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 6',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN26 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN26Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN26Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 7',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN27 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN27Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN27Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 8',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN28 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN28Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN28Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 9',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN29 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN29Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN29Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 10',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN210 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN210Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN210Total int(4)'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      QuestionName: 'Unit 3',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Module 1',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN31 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN31Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN31Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 2',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN32 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN32Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN32Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 3',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN33 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN33Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN33Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 4',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN34 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN34Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN34Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 5',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN35 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN35Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN35Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 6',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN36 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN36Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN36Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 7',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN37 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN37Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN37Total int(4)'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      QuestionName: 'Unit 4',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Module 1',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN41 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN41Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN41Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 2',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN42 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN42Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN42Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 3',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN43 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN43Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN43Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 4',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN44 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN44Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN44Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 5',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN45 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN45Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN45Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 6',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKPN46 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKPN46Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKPN46Total int(4)'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  QuestionName: 'Getting Acquainted',
                  InputType: 'QuestionGroup',
                  SubQuestions: [
                    {
                      QuestionName: 'Module 1',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'GGKAquainted1 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'GGKAquainted1Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'GGKAquainted1Total int(4)'
                        }
                      ]
                    },
                    {
                      QuestionName: 'Module 2',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Used',
                          InputType: 'CheckBox',
                          OldDBLocation: 'GGKAquainted2 int(1)'
                        },
                        {
                          QuestionName: 'Last Used',
                          InputType: 'Date',
                          OldDBLocation: 'GGKAquainted2Date date'
                        },
                        {
                          QuestionName: 'Total (times used)',
                          InputType: 'Number',
                          OldDBLocation: 'GGKAquainted2Total int(4)'
                        }
                      ]
                    }
                  ]
                },
                {
                  QuestionName: 'Birth to 12 Months (36 months?)',
                  InputType: 'QuestionGroup',
                  SubQuestions: [
                    {
                      QuestionName: '0-3 Months',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Module 1',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12031 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12031Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12031Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 2',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12032 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12031Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12031Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 3',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12033 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12031Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12031Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 4',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12034 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12031Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12031Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 5',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12035 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12031Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12031Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 6',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12036 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12031Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12031Total int(4)'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      QuestionName: '4-6 Months',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Module 1',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12461 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12461Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12461Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 2',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12462 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12461Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12461Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 3',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12463 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12461Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12461Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 4',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12464 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12461Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12461Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 5',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12465 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12461Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12461Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 6',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12466 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12461Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12461Total int(4)'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      QuestionName: '7-9 Months',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Module 1',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12791 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12791Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12791Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 2',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12792 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12791Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12791Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 3',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12793 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12791Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12791Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 4',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12794 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12791Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12791Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 5',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12795 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12791Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12791Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 6',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB12796 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB12791Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB12791Total int(4)'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      QuestionName: '10-12 Months',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Module 1',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1210121 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1210121Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1210121Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 2',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1210122 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1210121Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1210121Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 3',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1210123 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1210121Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1210121Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 4',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1210124 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1210121Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1210121Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 5',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1210125 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1210121Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1210121Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 6',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1210126 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1210121Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1210121Total int(4)'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      QuestionName: '13-15 Months',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Module 1',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1213151 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1213151Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1213151Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 2',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1213152 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1213151Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1213151Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 3',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1213153 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1213151Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1213151Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 4',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1213154 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1213151Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1213151Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 5',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1213155 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1213151Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1213151Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 6',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1213156 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1213151Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1213151Total int(4)'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      QuestionName: '16-18 Months',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Module 1',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1216181 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1216181Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1216181Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 2',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1216182 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1216181Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1216181Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 3',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1216183 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1216181Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1216181Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 4',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1216184 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1216181Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1216181Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 5',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1216185 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1216181Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1216181Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 6',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1216186 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1216181Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1216181Total int(4)'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      QuestionName: '19-21 Months',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Module 1',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1219211 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1219211Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1219211Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 2',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1219212 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1219211Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1219211Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 3',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1219213 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1219211Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1219211Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 4',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1219214 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1219211Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1219211Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 5',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1219215 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1219211Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1219211Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 6',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1219216 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1219211Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1219211Total int(4)'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      QuestionName: '22-24 Months',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Module 1',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1222241 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1222241Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1222241Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 2',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1222242 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1222241Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1222241Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 3',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1222243 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1222241Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1222241Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 4',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1222244 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1222241Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1222241Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 5',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1222245 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1222241Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1222241Total int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Module 6',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGKB1222246 int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGKB1222241Date date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGKB1222241Total int(4)'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      QuestionName: '25-30 Months',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Basic Care',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGK2530BasicCare int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGK2530BasicCareDate date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGK2530BasicCareTotal int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Social and Emotional Development',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGK2530SocialEmotion int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGK2530SocialEmotionDate date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGK2530SocialEmotionTotal int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Cues and Communication',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGK2530CuesCommunication int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGK2530CuesCommunicationDate date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation:
                                'GGK2530CuesCommunicationTotal int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Physical Brain Development',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGK2530PhysicalBrainDev int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGK2530PhysicalBrainDevDate date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation:
                                'GGK2530PhysicalBrainDevTotal int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Play and Stimulation',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGK2530PlayStimulation int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGK2530PlayStimulationDate date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation:
                                'GGK2530PlayStimulationTotal int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: "Parents' Corner",
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGK2530ParentsCorner int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGK2530ParentsCornerDate date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGK2530ParentsCornerTotal int(4)'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      QuestionName: '31-36 Months',
                      InputType: 'QuestionGroup',
                      SubQuestions: [
                        {
                          QuestionName: 'Basic Care',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGK3136BasicCare int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGK3136BasicCareDate date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGK3136BasicCareTotal int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Social and Emotional Development',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGK3136SocialEmotion int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGK3136SocialEmotionDate date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGK3136SocialEmotionTotal int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Cues and Communication',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGK3136CuesCommunication int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGK3136CuesCommunicationDate date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation:
                                'GGK3136CuesCommunicationTotal int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Physical Brain Development',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGK3136PhysicalBrainDev int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGK3136PhysicalBrainDevDate date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation:
                                'GGK3136PhysicalBrainDevTotal int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: 'Play and Stimulation',
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGK3136PlayStimulation int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGK3136PlayStimulationDate date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation:
                                'GGK3136PlayStimulationTotal int(4)'
                            }
                          ]
                        },
                        {
                          QuestionName: "Parents' Corner",
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Used',
                              InputType: 'CheckBox',
                              OldDBLocation: 'GGK3136ParentsCorner int(1)'
                            },
                            {
                              QuestionName: 'Last Used',
                              InputType: 'Date',
                              OldDBLocation: 'GGK3136ParentsCornerDate date'
                            },
                            {
                              QuestionName: 'Total (times used)',
                              InputType: 'Number',
                              OldDBLocation: 'GGK3136ParentsCornerTotal int(4)'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    {
      TabName: 'Survey',
      Sections: [
        {
          SectionNote:
            'Each Question has a TEXTAREA for comments/answer to question. Each Question Scored (0,5,10,U,NA) for both Mom/Primary Caregiver(PC) and Dad/Parenting Partner(PP) questions are then totaled for each. Each parent has a TEXT input for reason for score. Answers cannot be modified once marked finished',
          Questions: [
            {
              QuestionName: 'Survey is Finished',
              InputType: 'Checkbox',
              OldDBLocations: 'SurveyFinished tinyint'
            },
            {
              QuestionName: "Parent's Childhood Experience",
              QuestionDescription:
                'Discipline, nurturer, domestic violence in the home, alcohol or substance abuse in the home, running away, sexual abuse',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Text',
                  InputType: 'TextArea',
                  OldDBLocation: 'PSurvey1Text longtext'
                },
                {
                  QuestionName: 'PCScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PSurvey1Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PCReason',
                  InputType: 'Text',
                  OldDBLocation: 'PSurvey1Reason text'
                },
                {
                  QuestionName: 'PPScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PPSurvey1Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PPReason',
                  InputType: 'Text',
                  OldDBLocation: 'PPSurvey1Reason text'
                }
              ]
            },
            {
              QuestionName: 'Lifestyle Behaviors and Mental Health',
              QuestionDescription:
                'Drugs, Substance/Alcohol Use (remember to quantify), Mental Health, Criminal History',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Text',
                  InputType: 'TextArea',
                  OldDBLocation: 'PSurvey2Text longtext'
                },
                {
                  QuestionName: 'PCScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PSurvey2Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PCReason',
                  InputType: 'Text',
                  OldDBLocation: 'PSurvey2Reason text'
                },
                {
                  QuestionName: 'PPScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PPSurvey2Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PPReason',
                  InputType: 'Text',
                  OldDBLocation: 'PPSurvey2Reason text'
                }
              ]
            },
            {
              QuestionName: 'Parenting Experience',
              QuestionDescription:
                'Experience with CPS in parenting, caretaking role, such as babysitter, stepparent, etc., and any prior experience with children in general',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Text',
                  InputType: 'TextArea',
                  OldDBLocation: 'PSurvey3Text longtext'
                },
                {
                  QuestionName: 'PCScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PSurvey3Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PCReason',
                  InputType: 'Text',
                  OldDBLocation: 'PSurvey3Reason text'
                },
                {
                  QuestionName: 'PPScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PPSurvey3Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PPReason',
                  InputType: 'Text',
                  OldDBLocation: 'PPSurvey3Reason text'
                }
              ]
            },
            {
              QuestionName: 'Coping Skills and Support System',
              QuestionDescription:
                'Prenatal care, education, employment, transportation, phone access, lifelines, depression/sadness, coping strategies',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Text',
                  InputType: 'TextArea',
                  OldDBLocation: 'PSurvey4Text longtext'
                },
                {
                  QuestionName: 'PCScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PSurvey4Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PCReason',
                  InputType: 'Text',
                  OldDBLocation: 'PSurvey4Reason text'
                },
                {
                  QuestionName: 'PPScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PPSurvey4Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PPReason',
                  InputType: 'Text',
                  OldDBLocation: 'PPSurvey4Reason text'
                }
              ]
            },
            {
              QuestionName: 'Stresses',
              QuestionDescription:
                'Relationship (between baby’s parents), Housing, Moves, Finances, Job Changes, Medical, Other',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Text',
                  InputType: 'TextArea',
                  OldDBLocation: 'PSurvey5Text longtext'
                },
                {
                  QuestionName: 'PCScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PSurvey5Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PCReason',
                  InputType: 'Text',
                  OldDBLocation: 'PSurvey5Reason text'
                },
                {
                  QuestionName: 'PPScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PPSurvey5Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PPReason',
                  InputType: 'Text',
                  OldDBLocation: 'PPSurvey5Reason text'
                }
              ]
            },
            {
              QuestionName: 'Anger Management Skills',
              QuestionDescription: 'with parenting partner and with others',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Text',
                  InputType: 'TextArea',
                  OldDBLocation: 'PSurvey6Text longtext'
                },
                {
                  QuestionName: 'PCScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PSurvey6Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PCReason',
                  InputType: 'Text',
                  OldDBLocation: 'PSurvey6Reason text'
                },
                {
                  QuestionName: 'PPScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PPSurvey6Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PPReason',
                  InputType: 'Text',
                  OldDBLocation: 'PPSurvey6Reason text'
                }
              ]
            },
            {
              QuestionName:
                "Expectations of Infant's Developmental Milestones and Behaviors",
              QuestionDescription:
                'Walking (and when to worry), toilet training (begins and when to worry), crying scenario (how long before responding, what would they try, what they would do if they’ve tried everything and baby still won’t stop crying), spoiling (including can you spoil a baby under 12 months',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Text',
                  InputType: 'TextArea',
                  OldDBLocation: 'PSurvey7Text longtext'
                },
                {
                  QuestionName: 'PCScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PSurvey7Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PCReason',
                  InputType: 'Text',
                  OldDBLocation: 'PSurvey7Reason text'
                },
                {
                  QuestionName: 'PPScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PPSurvey7Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PPReason',
                  InputType: 'Text',
                  OldDBLocation: 'PPSurvey7Reason text'
                }
              ]
            },
            {
              QuestionName: 'Plans for Discipline',
              QuestionDescription:
                'Use of implements, if hitting, when they would start. For examples: Infant (baby under 1 year throwing food from high chair or crawling toward moveable object; Toddler (baby around 15-18 months old pushing buttons on TV; Child (child age 2-3 years refusing to do what parents ask, running toward a busy street.',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Text',
                  InputType: 'TextArea',
                  OldDBLocation: 'PSurvey8Text longtext'
                },
                {
                  QuestionName: 'PCScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PSurvey8Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PCReason',
                  InputType: 'Text',
                  OldDBLocation: 'PSurvey8Reason text'
                },
                {
                  QuestionName: 'PPScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PPSurvey8Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PPReason',
                  InputType: 'Text',
                  OldDBLocation: 'PPSurvey8Reason text'
                }
              ]
            },
            {
              QuestionName: 'Perception of New Infant',
              QuestionDescription: 'Baby’s personality or temperament',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Text',
                  InputType: 'TextArea',
                  OldDBLocation: 'PSurvey9Text longtext'
                },
                {
                  QuestionName: 'PCScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PSurvey9Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PCReason',
                  InputType: 'Text',
                  OldDBLocation: 'PSurvey9Reason text'
                },
                {
                  QuestionName: 'PPScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PPSurvey9Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PPReason',
                  InputType: 'Text',
                  OldDBLocation: 'PPSurvey9Reason text'
                }
              ]
            },
            {
              QuestionName: 'Bonding and Attachment',
              QuestionDescription:
                'How they felt at first, how they feel now, married, impact on life',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Text',
                  InputType: 'TextArea',
                  OldDBLocation: 'PSurvey10Text longtext'
                },
                {
                  QuestionName: 'PCScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PSurvey10Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PCReason',
                  InputType: 'Text',
                  OldDBLocation: 'PSurvey10Reason text'
                },
                {
                  QuestionName: 'PPScore',
                  InputType: 'Radio',
                  OldDBLocation: 'PPSurvey10Score varchar(6)',
                  Options: [0, 5, 10, 'U', 'NA']
                },
                {
                  QuestionName: 'PPReason',
                  InputType: 'Text',
                  OldDBLocation: 'PPSurvey10Reason text'
                }
              ]
            },
            {
              QuestionName: 'Total Score (PC)',
              InputType: 'Number',
              OldDBLocation: 'SurveyTotal int'
            },
            {
              QuestionName: 'Total Score (PP)',
              InputType: 'Number',
              OldDBLocation: 'SurveyTotalPP int(4)'
            },
            {
              QuestionName:
                'Mom/PC (and/or) Dad/PP Strengths and Protective Factors',
              InputType: 'Textarea',
              OldDBLocation: 'SurveyStrengthProtectiveFactors text'
            }
          ]
        }
      ]
    },

    {
      TabName: 'Summary',
      Sections: [
        {
          SectionName: 'SummaryInformation',
          Questions: [
            {
              QuestionsName:
                "Cues. Parents' recognition and response to engagement and disengagement signals. How the parent responds to the child's signals of hunger, thirst, want of comfort, stimulation, distress, or other needs. The capacity of the parent to engage the child effectively and to respond to the child's expressed needs in an appropriate manner. Primary GGK Tools: E-parenting Daily Do, Getting in Sync With My Baby, Ready to Play.",
              InputType: 'Textarea',
              OldDBLocation: 'visitsummaryC longtext'
            },
            {
              QuestionsName:
                "Holding. The frequency and nature of touching between parent and child is an indicator of the comfort level in the relationship. Consider spatial closeness: How gentle or rough the parent's touch is and how often the baby is held. How sensitive is the parent to the infant's tolerance and need for tough and tactile stimulation? Is their touch over or under stimulating, loving or harsh? Primary GGK Tools: Character Builders Daily Do, E-Parenting Daily Do, Getting in Sync With My Baby.",
              InputType: 'Textarea',
              OldDBLocation: 'visitsummaryH longtext'
            },
            {
              QuestionsName:
                "Expression. How parents use their voice to comfort, interact with and stimulate their baby. How much does the parent talk with their baby? Is the parent able to identify and 'Put the babies feelings into words?' How often does the parent engage the infant verbally, encouraging the infant to have a face-to-face converstion? Is the verbal interaction a 2-way communication? Primary GGK Tools: Play-by-Play Daily Do, E-Parenting Daily Do, The 4 Steps to Success Daily Do.",
              InputType: 'Textarea',
              OldDBLocation: 'visitsummaryE1 longtext'
            },
            {
              QuestionsName:
                "Empathy. Parents' capacity to comfort and support their infant's development of self-regulation. Frequency and quality of parent's responsiveness. Does the parent express and demonstrate concern about how the child is feeling? Whose needs come first, the baby's or the parents's? Does the parent recognize the full spectrum of the emotions a baby/child can experience and respond accordingly? How do the parents respond to their infant's comfort seeking and guidance seeking behaviors? Frequency of parent's joyful interactions with their child. Primary GGK Tools: E-Parenting Daily Do, Character Builders Daily Do, Getting in Sync With My Baby, Ready for Play?",
              InputType: 'Textarea',
              OldDBLocation: 'visitsummaryE2 longtext'
            },
            {
              QuestionsName:
                "Environmental. How the home environment and the 'environment of the relationship' supports the child's cognitive, social-emotional, physical, and language developmental needs. How much interest do the parents show in playing with their baby? Frequency of parent-child interaction aimed at optimizing thie child's development in all domains. How often is the TV/DVD used as a form of child care or stimulation? How safe does the child feel in exploring their environment in the presence of the parent? As the infant grows into a toddler, how does the parent modify the environment to support the child to learn self-regulation? As the infant grows into a toddler, how does the family maintain a positive attitude toward the child's need to explore and to become more independent? Primary GGK Tools: Brain Builders Daily Do, Character Builders Daily Do, GGK Child Development Activites, Body Builders Daily Do, The 4 Steps to Success Daily Do, Ready for Play?",
              InputType: 'Textarea',
              OldDBLocation: 'visitsummaryE3 longtext'
            },
            {
              QuestionsName:
                "Rhythmicity/Reciprocity. Are they dancing? Is there a smooth rhythm of give and take, and the back and forth qualities of the parent-child relationship? Responsiveness to the parent's interactions to the child's temperament, cues and developmental stage. Is there mutual initiation of the interactions and activites? Primary GGK Tools: E-Parenting Daily Do, Getting in Sync With My Baby, Ready for Play?, The 4 Steps to Success Daily Do",
              InputType: 'Textarea',
              OldDBLocation: 'visitsummaryR longtext'
            },
            {
              QuestionsName:
                "Smiles. Depth and frequency of joy-filled interactions. How much observable joy is there when the parent and child interact? Does the parent enjoy parenting? How frequently is the parent 'delighted' with their child? Is the parent showing signs of depression that are decreasing the capacity to smile and share happiness with their child? What steps are the parents taking to reduce 'toxic stress,' freeing them up to enjoy their child?Primary GGK Tools: Depression Screening and Referral for Treatment as Needed, Character Builders Daily Do, E-Parenting Daily Do, Growing Great Families Modules.",
              InputType: 'Textarea',
              OldDBLocation: 'visitsummaryS longtext'
            },
            {
              QuestionsName: 'Additional Comments',
              InputType: 'Textarea',
              OldDBLocation: 'visitsummaryOther longtext'
            },
            {
              QuestionsName: 'Plan For Next Visit',
              InputType: 'Textarea',
              OldDBLocation: 'PlanForNextVisit longtext'
            },
            {
              QuestionsName: "Reviewed 'Visit Summary' with Client",
              InputType: 'Checkbox',
              OldDBLocation: 'visitsummaryreviewed tinyint'
            }
          ]
        },
        {
          SectionName: 'Internal Comments',
          Questions: [
            {
              QuestionsName: 'Comments to Reviewer',
              InputType: 'Textarea',
              OldDBLocation: 'CommentsToReviewer longtext'
            },
            {
              QuestionsName: 'Reviewer Comments',
              InputType: 'Textarea'
            }
          ]
        }
      ]
    }
  ]
};

export const CHILD = {
  FormName: 'Initial Child Visit Form',
  Tabs: [
    {
      TabName: 'Visit',
      Sections: [
        {
          Questions: [
            {
              QuestionName: 'Visit Number',
              InputType: 'Number',
              OldDBLocation: 'VisitNumber',
              OldDBType: 'int(3)'
            },
            {
              QuestionName: 'OS ID',
              InputType: 'Number',
              OldDBLocation: 'WKOID',
              OldDBType: 'int(4)'
            },
            {
              QuestionName: 'Client ID',
              InputType: 'Number',
              OldDBLocation: 'ClientID',
              OldDBType: 'int(5)'
            },
            {
              QuestionName: 'Family ID',
              InputType: 'Number',
              OldDBLocation: 'FamilyID',
              OldDBType: 'int(5)'
            },
            {
              QuestionName: 'Time Start',
              InputType: 'Time',
              OldDBLocation: 'StartTime',
              OldDBType: 'time'
            },
            {
              QuestionName: 'Time End',
              InputType: 'Time',
              OldDBLocation: 'EndTime',
              OldDBType: 'time'
            },
            {
              QuestionName: 'Visit Date',
              InputType: 'Date',
              OldDBLocation: 'VisitDate',
              OldDBType: 'date'
            },
            {
              QuestionName: 'Initial Visit Date',
              InputType: 'Date',
              OldDBLocation: 'InitialVisitDate',
              OldDBType: 'date'
            },
            {
              QuestionName: 'Last Visit Date',
              InputType: 'Date',
              OldDBLocation: 'LastVisitDate',
              OldDBType: 'date'
            },
            {
              QuestionName: 'Previous Client',
              InputType: 'Checkbox',
              OldDBLocation: 'ClientType',
              OldDBType: 'tinyint'
            },
            {
              QuestionName: 'Client Type',
              InputType: 'Checkbox',
              OldDBLocation: 'ClientType',
              OldDBType: 'varchar(50)',
              Options: [
                'HFA',
                'A2A',
                'MO HV',
                {
                  Other: {
                    InputType: 'Text',
                    OldDBLocation: 'ClientType',
                    OldDBType: 'varchar(50)',
                    OldDBNote: 'Hopefully'
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      TabName: 'Demographic',
      Sections: [
        {
          Questions: [
            {
              QuestionName: "Child's Name",
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'First Name',
                  InputType: 'Text',
                  OldDBLocation: 'First',
                  OldDBType: 'varchar(20)'
                },
                {
                  QuestionName: 'Last Name',
                  InputType: 'Text',
                  OldDBLocation: 'Last',
                  OldDBType: 'varchar(20)'
                }
              ]
            },
            {
              QuestionName: 'Social Security Number',
              InputType: 'SSN',
              OldDBLocation: 'SSN',
              OldDBType: 'varchar(20)'
            },
            {
              QuestionName: "Legal Guardian's Name",
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'First Name',
                  InputType: 'Text',
                  OldDBLocation: 'GaurdianFirstName',
                  OldDBType: 'varchar(45)'
                },
                {
                  QuestionName: 'Last Name',
                  InputType: 'Text',
                  OldDBLocation: 'GaurdianLastName',
                  OldDBType: 'varchar(45)'
                }
              ]
            },
            {
              QuestionName: 'Child lives with (name)',
              InputType: 'Text',
              OldDBLocation: 'ChildLivesWithName',
              OldDBType: 'varchar(45)'
            },
            {
              QuestionName: 'Child lives with (ID)',
              InputType: 'Number',
              OldDBLocation: 'ChildLivesWithAdultID',
              OldDBType: 'varchar(45)'
            },
            {
              QuestionName: 'How many days per week?',
              InputType: 'Select',
              OldDBLocation: 'LivesWithNumberOfDays int',
              Options: [1, 2, 3, 4, 5, 6, 7]
            }
          ]
        },
        {
          Questions: [
            {
              QuestionName: 'Gender',
              InputType: 'Radio',
              OldDBLocation: 'Gender',
              OldDBType: 'varchar(6)',
              Options: ['male', 'female']
            },
            {
              QuestionName: 'Date of Birth',
              InputType: 'Date',
              OldDBLocation: 'DateOfBirth',
              OldDBType: 'date'
            },
            {
              QuestionName: 'Age at time of visit',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Years',
                  InputType: 'Number',
                  OldDBLocation: 'ageyears',
                  OldDBType: 'int(3)'
                },
                {
                  QuestionName: 'Months',
                  InputType: 'Number',
                  OldDBLocation: 'agemonths',
                  OldDBType: 'int(3)'
                }
              ]
            }
          ]
        },
        {
          Questions: [
            {
              QuestionName: 'Height',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'ft',
                  InputType: 'Number',
                  OldDBLocation: 'HeightFeet',
                  OldDBType: 'int'
                },
                {
                  QuestionName: 'in',
                  InputType: 'Number',
                  OldDBLocation: 'HeightInches',
                  OldDBType: 'int'
                }
              ]
            },
            {
              QuestionName: 'Old Height',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'ft',
                  InputType: 'Number'
                },
                {
                  QuestionName: 'in',
                  InputType: 'Number'
                }
              ]
            },
            {
              QuestionName: 'Current Weight',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'lb',
                  InputType: 'Number',
                  OldDBLocation: 'CurrentWeightIbs varchar(45)'
                },
                {
                  QuestionName: 'oz',
                  InputType: 'Number',
                  OldDBLocation: 'CurrentWeightOz varchar(45)'
                },
                {
                  QuestionName: 'kg',
                  InputType: 'Number',
                  OldDBLocation: 'CurrentWeightKil varchar(45)'
                }
              ]
            },
            {
              QuestionName: 'Old Weight',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'lb',
                  InputType: 'Number'
                },
                {
                  QuestionName: 'oz',
                  InputType: 'Number',
                  OldDBNote: 'Hopefully OldWeightOz varchar(45) is empty'
                }
              ]
            },
            {
              QuestionName: 'Weight Change',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'lb',
                  InputType: 'Number',
                  OldDBLocation: 'WeightChangeLbs int'
                },
                {
                  QuestionName: 'oz',
                  InputType: 'Number',
                  OldDBLocation: 'WeightChangeOz varchar(45)'
                }
              ]
            },
            {
              QuestionName: 'New BMI',
              InputType: 'Number',
              OldDBLocation: 'BMI int'
            },
            {
              QuestionName: 'Old BMI',
              InputType: 'Number'
            },
            {
              QuestionName: 'BMI Change',
              InputType: 'Number',
              OldDBLocation: 'BMIChange int'
            }
          ]
        },
        {
          Questions: [
            {
              QuestionName: 'Infant Weight (at birth)',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'lb',
                  InputType: 'Number',
                  OldDBLocation: 'InfantWeightLbs varchar(45)'
                },
                {
                  QuestionName: 'oz',
                  InputType: 'Number',
                  OldDBLocation: 'InfantWeightOz varchar(45)'
                },
                {
                  QuestionName: 'kg',
                  InputType: 'Number',
                  OldDBLocation: 'InfantWeightKil varchar(45)'
                }
              ]
            }
          ]
        },
        {
          Questions: [
            {
              QuestionName: 'County',
              InputType: 'Radio',
              OldDBLocation: 'County',
              OldDBType: 'varchar(50)',
              Options: [
                'Butler',
                'Carter',
                'Iron',
                'Reynolds',
                'Shannon',
                'Wayne',
                {
                  Other: {
                    InputType: 'Text',
                    OldDBLocation: 'County',
                    OldDBType: 'varchar(50)',
                    OldDBNote: 'Hopefully'
                  }
                }
              ]
            },

            {
              QuestionName: 'Race',
              InputType: 'Checkboxes',
              OldDBLocation: 'Race',
              OldDBType: 'varchar(200)',
              Options: [
                'African American',
                'Asian or Pacific Islander',
                'Caucasian',
                'Hispanic',
                {
                  Other: {
                    InputType: 'Text',
                    OldDBLocation: 'Race',
                    OldDBType: 'varchar(200)',
                    OldDBNote: 'Hopefully'
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      TabName: 'Medical',
      Sections: [
        {
          SectionName: 'Medical Information',
          Questions: [
            {
              QuestionName: 'Type of Insurance',
              InputType: 'Checkboxes',
              OldDBLocation: 'Insurance',
              OldDBType: 'varchar(100)',
              Options: [
                'No Insurance',
                {
                  Medicaid: {
                    InputType: 'QuestionGroup',
                    SubQuestions: [
                      {
                        QuestionName: 'Medicaid #',
                        InputType: 'Text',
                        OldDBLocation: 'MedicaidNumber',
                        OldDBType: 'varchar(20)'
                      },
                      {
                        QuestionName: 'Pending',
                        InputType: 'Checkbox',
                        OldDBLocation: 'MedicaidPending',
                        OldDBType: 'tinyint'
                      },
                      {
                        QuestionName: 'Inactive',
                        InputType: 'Checkbox',
                        OldDBLocation: 'MedicaidInactive',
                        OldDBType: 'tinyint(1)'
                      }
                    ]
                  }
                },
                {
                  'Other Insurance': {
                    InputType: 'Text',
                    OldDBLocation: 'Insurance',
                    OldDBType: 'varchar(100)',
                    OldDBNote: 'Hopefully'
                  }
                }
              ]
            },
            {
              QuestionName: "Doctor's Name",
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'First',
                  InputType: 'Text',
                  OldDBLocation: 'DoctorsFirstName',
                  OldDBType: 'varchar(45)'
                },
                {
                  QuestionName: 'Last',
                  InputType: 'Text',
                  OldDBLocation: 'DoctorsLastName',
                  OldDBType: 'varchar(50)'
                }
              ]
            },
            {
              QuestionName: 'Type of Provider',
              InputType: 'Select',
              OldDBLocation: 'DB:HealthCareProviderType varchar(50)',
              Options: [
                'Pediatrician',
                'Family Doctor',
                'Family Nurse Practicioner',
                'Pediatric Nurse Practicioner',
                'None',
                'Other'
              ]
            },
            {
              QuestionName: 'Medical, developmental or behavioral condition?',
              InputType: 'ConditionalInput - Checkbox',
              OldDBLocation: 'HasCondition tinyint',
              ConditionalInput: {
                Condition: 'Yes',
                QuestionName: 'Diagnosed?',
                InputType: 'ConditionalInput - Checkbox',
                OldDBLocation: 'Diagnosed tinyint(1)',
                ConditionalInput: {
                  Condition: 'Yes',
                  QuestionName: 'Specify',
                  InputType: 'Textarea',
                  OldDBLocation:
                    'MedicalDevelopmentalBehavioralCondition longtext'
                }
              }
            }
          ]
        },
        {
          SectionName: 'Medical Visits - scheduled',
          Questions: [
            {
              QuestionName: 'Last Clinic Visit',
              InputType: 'Date',
              OldDBLocation: 'LastClinicVisitDate',
              OldDBType: 'date'
            },
            {
              QuestionName: 'Next Clinic Visit',
              InputType: 'Date',
              OldDBLocation: 'NextClinicVisitDate',
              OldDBType: 'date'
            },
            {
              QuestionName: 'Not Scheduled',
              InputType: 'Checkbox',
              OldDBLocation: 'NextClinicNotSched',
              OldDBType: 'int(1)'
            },
            {
              QuestionName: 'Kept last appointment',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'KeptLastAppointment',
              OldDBType: 'tinyint',
              ConditionalInput: {
                Condition: 'No',
                QuestionName: 'Specify',
                InputType: 'TextArea',
                OldDBLocation: 'KeptLastAppointmentSpecify',
                OldDBType: 'longtext'
              }
            }
          ]
        },
        {
          SectionName: 'Medical Visits - unscheduled',
          Questions: [
            {
              QuestionName:
                'Has the client seen another healthcare provider since the last home visit?',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'UnscheduledVisit',
              OldDBType: 'tinyint',
              ConditionalInput: {
                Condition: 'Yes',
                QuestionName: 'Specify',
                InputType: 'TextArea',
                OldDBLocation: 'UnscheduledVisitSpecify',
                OldDBType: 'longtext'
              }
            },
            {
              QuestionName:
                'Was the child treated in an Emergency Room since the last home visit? ',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'ChildTreadedInEmergencyRoomSinceLast tinyint(1)',
              ConditionalInput: {
                Condition: 'Yes',
                QuestionName: 'Specify',
                InputType: 'QuestionGroup',
                SubQuestions: [
                  {
                    QuestionName: 'Date of ER visit',
                    InputType: 'Date',
                    OldDBLocation: 'ChildTreatedEmergencyRoomDate date'
                  },
                  {
                    QuestionName: 'Reason for ER visit',
                    InputType: 'Radio',
                    OldDBLocation: 'ERReason text',
                    Options: [
                      'Burn',
                      'Fall',
                      'Road Traffic Injury',
                      'Near Suffocation',
                      'Near Drowning',
                      'Poisoning',
                      {
                        'Other injury caused by safety problem': {
                          InputType: 'QuestionGroup',
                          SubQuestions: [
                            {
                              QuestionName: 'Safety Problem',
                              InputType: 'Text',
                              OldDBLocation: 'ERReasonOtherSafety text'
                            },
                            {
                              QuestionName: 'Injury',
                              InputType: 'Text',
                              OldDBLocation: 'ERReasonOtherInjury text'
                            }
                          ]
                        }
                      },
                      {
                        'Other reason': {
                          QuestionName: 'Specify',
                          InputType: 'Text',
                          OldDBNote:
                            'Could be in ERReason text??Hopefully..maybe:ERVisitReasonNotInList text'
                        }
                      }
                    ]
                  },
                  {
                    QuestionName: 'Was the cause preventable?',
                    InputType: 'Checkbox',
                    OldDBLocation: 'ERVisitPreventable varchar(3)'
                  }
                ]
              }
            }
          ]
        },
        {
          SectionName: 'Medical Visits - Specialist',
          Questions: [
            {
              QuestionName:
                'Has the client seen a specialist since the last visit?',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'SeenSpecialist',
              OldDBType: 'tinyint',
              ConditionalInput: {
                QuestionName: 'Specialist 1',
                InputType: 'QuestionGroup',
                SubQuestions: [
                  {
                    QuestionName: '',
                    InputType: 'QuestionGroup',
                    SubQuestions: [
                      {
                        QuestionName: 'Specialist 1 Name',
                        InputType: 'Text',
                        OldDBLocation: 'SpecialistLastName',
                        OldDBType: 'varchar(75)'
                      },
                      {
                        QuestionName: 'Specialty 1',
                        InputType: 'Text',
                        OldDBLocation: 'SpecialistField',
                        OldDBType: 'varchar(45)'
                      },
                      {
                        QuestionName: 'Last Visit 1',
                        InputType: 'Text',
                        OldDBLocation: 'SpecialistLastVisit',
                        OldDBType: 'varchar(10)'
                      },
                      {
                        QuestionName: 'Next Visit 1',
                        InputType: 'Text',
                        OldDBLocation: 'SpecialistNextVisit',
                        OldDBType: 'varchar(10)'
                      },
                      {
                        QuestionName: 'Not Scheduled 1',
                        InputType: 'Checkbox',
                        OldDBLocation: 'SpecialistNextNotSched',
                        OldDBType: 'int(1)'
                      },
                      {
                        QuestionName: 'Kept last appointment 1',
                        InputType: 'Radio',
                        OldDBLocation: 'KeptLastSpecialistAppointment1',
                        OldDBType: 'tinyint'
                      }
                    ]
                  },
                  {
                    QuestionName: 'Specialist 2',
                    InputType: 'QuestionGroup',
                    SubQuestions: [
                      {
                        QuestionName: 'Specialist 2 Name',
                        InputType: 'Text',
                        OldDBLocation: 'SpecialistLastName2',
                        OldDBType: 'varchar(150)'
                      },
                      {
                        QuestionName: 'Specialty 2 - TEXT',
                        InputType: 'Text',
                        OldDBLocation: 'SpecialistField2',
                        OldDBType: 'varchar(150)'
                      },
                      {
                        QuestionName: 'Last Visit 2 - TEXT',
                        InputType: 'Text',
                        OldDBLocation: 'Specialist2LastVisit',
                        OldDBType: 'varchar(10)'
                      },
                      {
                        QuestionName: 'Next Visit 2 - TEXT',
                        InputType: 'Text',
                        OldDBLocation: 'Specialist2NextVisit',
                        OldDBType: 'varchar(10)'
                      },
                      {
                        QuestionName: 'Not Scheduled 2',
                        InputType: 'Checkbox',
                        OldDBLocation: 'Specialist2NextNotSched',
                        OldDBType: 'int(1)'
                      },
                      {
                        QuestionName: 'Kept last appointment 2',
                        InputType: 'Radio',
                        OldDBLocation: 'KeptLastSpecialistAppointment2',
                        OldDBType: 'tinyint'
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        {
          SectionName: 'Medical Information',
          Questions: [
            {
              QuestionName: 'Breast Feeding',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'Breastfeeding tinyint(1)',
              ConditionalInput: {
                Condition: 'Yes',
                QuestionName: 'Number of weeks?',
                InputType: 'Number',
                OldDBLocation: 'NumberOfWeeksBreastfeeding int'
              }
            },
            {
              QuestionName: 'Low Infant Birth Weight (≤ 5 lb. 8 oz.)',
              InputType: 'Radio',
              OldDBLocation: 'LowBirthWeight tinyint(1)'
            },
            {
              QuestionName: 'Pre-term Delivery (< 37 weeks)',
              InputType: 'Radio',
              OldDBLocation: 'PretermDelivery tinyint'
            },
            {
              QuestionName: 'Problems at delivery',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'ProblemAtDelivery longtext',
              ConditionalInput: {
                Condition: 'Yes',
                QuestionName: 'Specify',
                InputType: 'Textarea',
                OldDBLocation: 'DB:ProblemAtDeliverySpecify longtext'
              }
            },
            {
              QuestionName: 'Immunizations Current',
              InputType: 'Radio',
              OldDBLocation: 'ImmunizationsCurrent tinyint(1)'
            },
            {
              QuestionName: 'Verified Immunizations Record',
              InputType: '',
              OldDBLocation: 'VerifiedImmunizationRecord tinyint(1)'
            },
            {
              QuestionName: 'UTD per perent Report',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'UTDPPR int(1)',
              ConditionalInput: {
                Condition: 'Yes',
                QuestionName: 'Specify',
                InputType: 'Textarea',
                OldDBLocation: 'UTDPPRComment varchar(150)'
              }
            },
            {
              QuestionName: 'History of Abuse/Neglect',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation: 'HistoryOfAbuse tinyint',
              ConditionalInput: {
                Condition: 'Yes',
                QuestionName: 'Specific History',
                InputType: 'Textarea',
                OldDBLocation: 'SpecifyHistoryOfAbuse longtext'
              }
            },
            {
              QuestionName: 'Abuse Record has changed',
              InputType: 'Radio',
              OldDBLocation: 'HistoryOfAbuseChanged tinyint'
            }
          ]
        },
        {
          SectionName: 'Medical Home',
          SectionDescription:
            'if all boxes are marked yes then child has a medical home',
          Questions: [
            {
              QuestionName:
                "Used appropriate Medical Provider for child's needs",
              InputType: 'Checkbox',
              OldDBLocation: 'UsedAppropriateMDforChildsNeeds tinyint(1)'
            },
            {
              QuestionName:
                'Used same Medical group (that has access to child’s medical records)',
              InputType: 'Checkbox',
              OldDBLocation: 'UsedSameMDforAllHealthIssues tinyint(1)'
            },
            {
              QuestionName:
                'Feels comfortable exchanging health information when needed with Medical Provider',
              InputType: 'Checkbox',
              OldDBLocation:
                'FeelsComfortableExchangingHealthInfoWithMD tinyint(1)'
            },
            {
              QuestionName:
                'Can access Medical Provider and services when needed',
              InputType: 'Checkbox',
              OldDBLocation: 'CanAccessMDandServicesWhenNeeded tinyint(1)'
            },
            {
              QuestionName:
                'Notifies primary Medical Provider of any health services child is/was receiving',
              InputType: 'Checkbox',
              OldDBLocation:
                'NotifiesPrimaryMDofAnyOtherHealthServicesChildIsReceiving tinyint(1)'
            },
            {
              QuestionName: 'Child has medical home?',
              InputType: 'Checkbox',
              OldDBLocation: 'MedicalHome varchar(10)'
            },
            {
              QuestionName: 'Medical Home Record has changed',
              InputType: 'Checkbox',
              OldDBLocation: 'MedicalHomeChanged tinyint'
            }
          ]
        }
      ]
    },
    {
      TabName: 'School',
      Sections: [
        {
          SectionName: 'School Information',
          Questions: [
            {
              QuestionName: 'Section does not apply',
              InputType: 'Checkbox',
              OldDBLocation: 'notInSchool tinyint'
            },
            {
              QuestionName: 'Name of School',
              InputType: 'Text',
              OldDBLocation: 'School varchar(50)'
            },
            {
              QuestionName: 'City',
              InputType: 'Text',
              OldDBLocation: 'SchoolCity varchar(50)'
            },
            {
              QuestionName: 'School Phone Number',
              InputType: 'US Phone Number',
              OldDBLocation: 'SchoolPhone varchar(50)'
            },
            {
              QuestionName: 'Grade',
              InputType: 'Select',
              OldDBLocation: 'SchoolGrade varchar(50)',
              Options: [
                'Preschool',
                'Head Start',
                'Kindergarten',
                'First',
                'Second',
                'Third',
                'Fourth',
                'Fifth',
                'Sixth',
                'Seventh',
                'Eighth',
                'Ninth',
                'Tenth',
                'Eleventh',
                'Twelfth'
              ]
            },
            {
              QuestionName: "Teacher's Name",
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'first',
                  InputType: 'Text',
                  OldDBLocation: 'TeachersFirstName varchar(45)'
                },
                {
                  QuestionName: 'last',
                  InputType: 'Text',
                  OldDBLocation: 'TeachersLastName varchar(50)'
                }
              ]
            },
            {
              QuestionName:
                'Identified learning or behavioral concerns at school',
              InputType: 'ConditionalInput - Radio',
              OldDBLocation:
                'IdentifiedLearningBehavioralConcernsAtSchool tinyint',
              ConditionalInput: {
                Condition: 'Yes',
                QuestionName: 'specify',
                InputType: 'Textarea',
                OldDBLocation:
                  'IdentifiedLearningBehavioralConcernsAtSchoolSpecify longtext'
              }
            }
          ]
        }
      ]
    },
    {
      TabName: 'ASQ',
      Sections: [
        {
          SectionName:
            'Infant/Child Ages & Stages Questionnaires (ASQ) - Update',
          Questions: [
            {
              QuestionName: 'Age (months)',
              InputType: 'Select',
              OldDBLocation: 'asqage int',
              Options: [
                2,
                4,
                6,
                8,
                9,
                10,
                12,
                14,
                16,
                18,
                20,
                22,
                24,
                27,
                30,
                33,
                36,
                42,
                48,
                54,
                60
              ]
            },
            {
              QuestionName: 'Communication',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Score',
                  InputType: 'Text',
                  OldDBLocation: 'asq1 varchar(5)'
                },
                {
                  QuestionName: 'N/E',
                  InputType: 'Radio',
                  OldDBLocation: 'asq2 varchar(5)'
                }
              ]
            },
            {
              QuestionName: 'Gross Motor',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Score',
                  InputType: 'Text',
                  OldDBLocation: 'asq3 varchar(5)'
                },
                {
                  QuestionName: 'N/E',
                  InputType: 'Radio',
                  OldDBLocation: 'asq4 varchar(5)'
                }
              ]
            },
            {
              QuestionName: 'Fine Motor',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Score',
                  InputType: 'Text',
                  OldDBLocation: 'asq5 varchar(5)'
                },
                {
                  QuestionName: 'N/E',
                  InputType: 'Radio',
                  OldDBLocation: 'asq6 varchar(5)'
                }
              ]
            },
            {
              QuestionName: 'Problem Solving',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Score',
                  InputType: 'Text',
                  OldDBLocation: 'asq7 varchar(5)'
                },
                {
                  QuestionName: 'N/E',
                  InputType: 'Radio',
                  OldDBLocation: 'asq8 varchar(5)'
                }
              ]
            },
            {
              QuestionName: 'Personal Social',
              InputType: 'QuestionGroup',
              SubQuestions: [
                {
                  QuestionName: 'Score',
                  InputType: 'Text',
                  OldDBLocation: 'asq9 varchar(5)'
                },
                {
                  QuestionName: 'N/E',
                  InputType: 'Radio',
                  OldDBLocation: 'asq10 varchar(5)'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      TabName: 'ASQ-SE',
      Sections: [
        {
          SectionName:
            'Infant/Child Ages & Stages Questionnaires: Social-Emotional (ASQ-SE) - Update',
          Questions: [
            {
              QuestionName: 'Age (months)',
              InputType: 'Select',
              OldDBLocation: 'SEAge int',
              Options: [6, 12, 18, 24, 30, 36, 48, 60]
            },
            {
              QuestionName: 'Score',
              InputType: 'Text',
              OldDBLocation: 'SEVal int'
            }
          ]
        }
      ]
    },
    {
      TabName: 'Summary',
      Sections: [
        {
          SectionName: 'Summary Information',
          Questions: [
            {
              QuestionsName: 'Visit Summary',
              InputType: 'Textarea',
              OldDBLocation: 'visitsummary longtext'
            },
            {
              QuestionsName: "Reviewed 'Visit Summary' with Client",
              InputType: 'Checkbox',
              OldDBLocation: 'visitsummaryreviewed tinyint'
            }
          ]
        },
        {
          SectionName: 'Internal Comments',
          Questions: [
            {
              QuestionsName: 'Comments to Reviewer',
              InputType: 'Textarea',
              OldDBLocation: 'CommentsToReviewer longtext'
            },
            {
              QuestionsName: 'Reviewer Comments',
              InputType: 'Textarea'
            }
          ]
        }
      ]
    }
  ]
};
