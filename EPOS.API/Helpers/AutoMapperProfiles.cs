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
            CreateMap<GuestForRegisterDto, Guest>();        
            CreateMap<Booking, BookingForListDto>();   
            CreateMap<Booking, BookingForViewDto>();  


            // Notes section
            CreateMap<Note, NoteforListDto>()
                .ReverseMap();       

            // Reservation section
            CreateMap<Reservation, ReservationForListDto>();  
            CreateMap<Reservation, ReservationForDetailDto>()  
                 .ReverseMap(); 

            // Taxi section
            CreateMap<Taxi, TaxiForListDto>();  
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
            CreateMap<Menu, MenuForUpdateDto>()
              .ForMember(mu => mu.MenuExtras, opt => opt.MapFrom(m => m.MenuExtras.Select(vf => new KeyValuePairDto { Id = vf.Extra.Id, Name = vf.Extra.ExtraName })));
            
            CreateMap<MenuForSaveDto, Menu>()
              .ForMember(v => v.Id, opt => opt.Ignore())
              .ForMember(v => v.MenuExtras, opt => opt.Ignore())
              .AfterMap((vr, v) => {
                // Remove unselected extras
                var removedExtras = v.MenuExtras.Where(f => !vr.MenuExtras.Contains(f.ExtraId)).ToList();
                foreach (var f in removedExtras)
                  v.MenuExtras.Remove(f);

                // Add new extras
                var addedExtras = vr.MenuExtras.Where(id => !v.MenuExtras.Any(f => f.ExtraId == id)).Select(id => new MenuExtra { ExtraId = id }).ToList();   
                foreach (var f in addedExtras)
                    v.MenuExtras.Add(f);
            });                                                                
        }
    }
}