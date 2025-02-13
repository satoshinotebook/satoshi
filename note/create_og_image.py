from PIL import Image, ImageDraw
import math

def create_og_image():
    # Create a new image with dark background (1200x630 is ideal for og:image)
    width = 1200
    height = 630
    bg_color = (28, 28, 28)  # Dark background matching your site
    accent_color = (255, 159, 28)  # Your orange accent color #FF9F1C
    
    # Create the image
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Calculate logo size and position (making it proportionally larger)
    logo_size = 300
    logo_x = (width - logo_size) // 2
    logo_y = (height - logo_size) // 2
    
    # Draw the vertical lines
    line_width = 6  # Thicker lines for larger image
    
    # Top and bottom vertical dashes
    center_x = width // 2
    draw.line([(center_x, logo_y + 17), (center_x, logo_y + 35)], 
              fill=accent_color, width=line_width)
    draw.line([(center_x, logo_y + logo_size - 35), (center_x, logo_y + logo_size - 17)], 
              fill=accent_color, width=line_width)
    
    # Three horizontal lines
    line_length = logo_size * 0.6
    start_x = center_x - (line_length // 2)
    end_x = center_x + (line_length // 2)
    
    y_positions = [
        logo_y + (logo_size * 0.36),
        logo_y + (logo_size * 0.52),
        logo_y + (logo_size * 0.68)
    ]
    
    for y in y_positions:
        draw.line([(start_x, y), (end_x, y)], 
                  fill=accent_color, width=line_width)
    
    # Save the image
    img.save('og-image.png', 'PNG')
    print("OG image created successfully!")

if __name__ == "__main__":
    create_og_image()