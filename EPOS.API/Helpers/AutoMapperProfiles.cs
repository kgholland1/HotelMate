using AutoMapper;
using System.Linq;
using EPOS.API.Dtos;
using EPOS.API.Models;

namespace EPOS.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // Guest section     
            CreateMap<GuestForRegisterDto, User>();        
            CreateMap<Booking, BookingForListDto>();   
            CreateMap<Booking, BookingForViewDto>();  


            // Notes section
            CreateMap<Note, NoteforListDto>()
                .ReverseMap();       

            // Reservation section
            CreateMap<Reservation, ReservationForListDto>()
                .ForMember(dest => dest.IsCompleted, opt => 
                {
                    opt.MapFrom(src => src.IsCompleted? "Yes": "No");
                }); 
            CreateMap<Reservation, ReservationForDetailDto>()  
                 .ReverseMap(); 
            CreateMap<ReservationForCreateDto, Reservation>();  

            // Taxi section
            CreateMap<Taxi, TaxiForListDto>();  
            CreateMap<TaxiForCreateDto, Taxi>();  
            CreateMap<Taxi, TaxiForUpdateDto>()  
                 .ReverseMap(); 

            // Luggage section
            CreateMap<Luggage, LuggageForListDto>();                 
            CreateMap<Luggage, LuggageForUpdateDto>()  
                 .ReverseMap(); 

            // Luggage section
            CreateMap<WakeUp, WakeForListDto>();                 
            CreateMap<WakeUp, WakeForUpdateDto>()  
                 .ReverseMap(); 

            //Hotel section
            CreateMap<Room, RoomForListDto>();  
            CreateMap<Room, RoomForUpdateDto>()
                .ReverseMap(); 

            CreateMap<HotelForCreateDto, Hotel>();     
            CreateMap<Hotel, HotelForUpdatesDto>()
                .ReverseMap(); 

            CreateMap<Notification, NotificationDto>();                     

            //Photo section
            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<Photo, PhotoForReturnDto>()
                .ReverseMap();

            //Tourist section
            CreateMap<Tourist, TouristForListDto>();  
            CreateMap<Tourist, TouristForUpdateDto>()
                .ReverseMap();

            // Payment section
            CreateMap<Payment, PaymentForListDto>();                  
            CreateMap<Payment, PaymentForUpdateDto>()
                .ReverseMap();   

            // Restaurant section
            CreateMap<Restaurant, RestaurantForListDto>();                  
            CreateMap<Restaurant, RestaurantForUpdateDto>()
                .ReverseMap();            

            // Open Hours section
            CreateMap<OpenTime, OpenHoursForListDto>();                  
            CreateMap<OpenTime, OpenHourForUpdateDto>()
                .ReverseMap();   

            //Auth Section 
            CreateMap<User, UserForSuccessfulDto>();    
            CreateMap<User, UserForListDto>();                    
            CreateMap<UserForRegisterDto, User>();            
            CreateMap<User, ProfileForDetailDto>()    
                .ForMember(dest => dest.HotelName, opt => 
                {
                    opt.MapFrom(src => src.hotel.HotelName);
                })
                .ForMember(dest => dest.HotelCode, opt => 
                {
                    opt.MapFrom(src => src.hotel.HotelCode);
                }); 
            CreateMap<ProfileForUpdateDto, User>();                           
            CreateMap<UserForUpdateDto, User>();

            //Menu Section
            CreateMap<Extra, ExtraForListDto>();
            CreateMap<Extra, ExtraForUpdateDto>()
                .ReverseMap();  
            CreateMap<CatHeader, KeyValuePairDto>()
                .ForMember(dest => dest.Name, opt => 
                {
                    opt.MapFrom(src => src.HeaderName);
                });             
            CreateMap<Category, CategoryForListDto>();
            CreateMap<Category, CategoryForUpdateDto>()
                .ReverseMap(); 
            CreateMap<Menu, MenuForListDto>()
                .ForMember(dest => dest.CatName, opt => 
                {
                    opt.MapFrom(src => src.Category.CatName);
                }); 
            
            CreateMap<Menu, MenuForUpdateDto>();
            CreateMap<MenuExtra, MenuExtraDto>()
                .ReverseMap(); 

            CreateMap<MenuForSaveDto, Menu>();

            // MenuOrder section
            CreateMap<MenuOrder, MenuOrderListDto>();  
            CreateMap<MenuOrderCreateDto, MenuOrder>();  
            CreateMap<MenuOrderDetail, MenuOrderDetailsDto>()
                .ReverseMap(); 
            CreateMap<MenuOrder, MenuOrderUpdateDto>()  
               .ReverseMap();                                                               
        }
    }
}